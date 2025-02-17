import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CategoriesService } from "../categories/categories.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { GetBookWithBreadcrumbDto } from "./dto/get-book-with-breadcrumb.dto";
import {GetBooksByCategoryDto} from "./dto/get-books-by-category.dto";
import {PaginationDto} from "./dto/pagination.dto";
import {DatabaseService} from "../database/database.service";
import {Prisma} from "@generated/client";
import {BookResponseDto} from "./dto/book-response.dto";
import {CreateBookResponseDto} from "./dto/create-book-response.dto";
import {UpdateBookResponseDto} from "./dto/update-book-response.dto";

@Injectable()
export class BooksService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly categoriesService: CategoriesService,
    ) {}

    async create(createBookDto: CreateBookDto): Promise<CreateBookResponseDto> {
        const existingBook = await this.databaseService.book.findUnique({
            where: { name: createBookDto.name },
        });
        if (existingBook) {
            throw new ConflictException('Book name already exists.');
        }

        const category = await this.categoriesService.findOne(createBookDto.categoryId);
        if (!category) {
            throw new NotFoundException(`Category with ID ${createBookDto.categoryId} not found.`);
        }

        const newBook = await this.databaseService.book.create({
            data: {
                name: createBookDto.name,
                author: createBookDto.author,
                description: createBookDto.description,
                category: {
                    connect: { id: createBookDto.categoryId }
                },
            },
        });

        return {
            id: newBook.id,
            name: newBook.name,
            author: newBook.author,
            description: newBook.description ?? undefined,
            categoryId: newBook.categoryId,
        }
    }

    async findAll(): Promise<BookResponseDto[]> {
        const books = await this.databaseService.book.findMany({
            include: { category: true },
        });
        return books.map(book => ({
            id: book.id,
            name: book.name,
            author: book.author,
            description: book.description ?? undefined,
            categoryId: book.categoryId,
        }));
    }

    async findOne(id: number): Promise<Prisma.BookGetPayload<{}>> {
        const book = await this.databaseService.book.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    }

    async findOneWithBreadcrumb(id: number): Promise<GetBookWithBreadcrumbDto> {
        const book = await this.findOne(id);

        if (!book.categoryId) {
            throw new NotFoundException('Category not found for the book');
        }
        const breadcrumbs = await this.getCategoryBreadcrumbs(book.categoryId);

        return {
            id: book.id,
            name: book.name,
            author: book.author,
            description: book.description ?? undefined,
            categoryId: book.categoryId,
            breadcrumbs,
        };
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<UpdateBookResponseDto> {
        const book = await this.findOne(id);

        if (updateBookDto.name) {
            const existingBook = await this.databaseService.book.findUnique({
                where: { name: updateBookDto.name },
            });
            if (existingBook && existingBook.id !== id) {
                throw new ConflictException('Book name already exists.');
            }
        }

        if (updateBookDto.categoryId) {
            const category = await this.categoriesService.findOne(updateBookDto.categoryId);
            if (!category) {
                throw new NotFoundException(`Category with ID ${updateBookDto.categoryId} not found.`);
            }
        }

        const { name, author, description } = updateBookDto;

        const updatedBook = await this.databaseService.book.update({
            where: { id },
            data: {
                name,
                author,
                description,
                category: updateBookDto.categoryId ?
                    { connect: {id: updateBookDto.categoryId}} : undefined,
            },
        });

        return {
            id: updatedBook.id,
            name: updatedBook.name,
            author: updatedBook.author,
            description: updatedBook.description ?? undefined,
            categoryId: updatedBook.categoryId
        };
    }

    async delete(id: number): Promise<void> {
        const book = await this.databaseService.book.delete({
            where: { id },
        }).catch( () => null);

        if (!book) {
            throw new NotFoundException('Book not found');
        }
    }

    async findByCategoryAndSubcategories(categoryId: number, paginationDto: PaginationDto): Promise<GetBooksByCategoryDto[]> {
        const category = await this.categoriesService.findOne(categoryId);
        const subcategoryIds = await this.categoriesService.getAllSubcategoryIdsRecursively(categoryId);

        const books = await this.databaseService.book.findMany({
            where: {
                OR: [
                    { categoryId: category.id },
                    ...subcategoryIds.map(id => ({ categoryId: id })),
                ],
            },
            include: { category: true },
            skip: paginationDto.skip,
            take: paginationDto.limit,
        });

        return books.map((book) => ({
            id: book.id,
            name: book.name,
            author: book.author,
            categoryId: book.category.id,
            description: book.description ?? undefined,
        }));
    }

    async getCategoryBreadcrumbs(categoryId: number): Promise<string[]> {
        const breadcrumbs: string[] = [];

        const category = await this.categoriesService.findOne(categoryId);
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        let path: string = category.name;

        const subcategories = await this.categoriesService.getSubcategories(categoryId);
        if (subcategories.length > 0) {
            for (const subcategory of subcategories) {
                const subcategoryPaths = await this.getCategoryBreadcrumbs(subcategory.id);
                for (const subcategoryPath of subcategoryPaths) {
                    breadcrumbs.push(path + ' > ' + subcategoryPath);
                }
            }
        } else {
            breadcrumbs.push(path);
        }

        return breadcrumbs;
    }

}
