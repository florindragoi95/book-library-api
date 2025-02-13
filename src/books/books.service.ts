import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CategoriesService } from "../categories/categories.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./book.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetBookWithBreadcrumbDto } from "./dto/get-book-with-breadcrumb.dto";
import {GetBooksByCategoryDto} from "./dto/get-books-by-category.dto";

@Injectable()
export class BooksService {

    constructor(
        private readonly categoriesService: CategoriesService,

        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) {}

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const existingBook = await this.bookRepository.findOne({ where: { name: createBookDto.name } });
        if (existingBook) {
            throw new ConflictException('Book name already exists.');
        }

        const category = await this.categoriesService.findOne(createBookDto.categoryId);
        if (!category) {
            throw new NotFoundException(`Category with ID ${createBookDto.categoryId} not found.`);
        }

        const newBook = this.bookRepository.create({
            name: createBookDto.name,
            author: createBookDto.author,
            category,
            description: createBookDto.description,
        });

        return this.bookRepository.save(newBook);
    }

    async findAll(): Promise<Book[]> {
        return this.bookRepository.find({ relations: ['category'] });
    }

    async findOne(id: number): Promise<Book> {
        const book = await this.bookRepository.findOne({ where: { id }, relations: ['category'] });
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    }

    async findOneWithBreadcrumb(id: number): Promise<GetBookWithBreadcrumbDto> {
        const book = await this.findOne(id);
        if (!book.category) {
            throw new NotFoundException('Category not found for the book');
        }

        const breadcrumb = await this.getCategoryBreadcrumb(book.category.id);

        return {
            id: book.id,
            name: book.name,
            author: book.author,
            description: book.description,
            categoryId: book.category.id,
            breadcrumb,
        };
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
        const book = await this.findOne(id);

        if (updateBookDto.name) {
            const existingBook = await this.bookRepository.findOne({ where: { name: updateBookDto.name } });
            if (existingBook && existingBook.id !== id) {
                throw new ConflictException('Book name already exists.');
            }
        }

        if (updateBookDto.categoryId) {
            const category = await this.categoriesService.findOne(updateBookDto.categoryId);
            if (!category) {
                throw new NotFoundException(`Category with ID ${updateBookDto.categoryId} not found.`);
            }
            book.category = category;
        }

        if (updateBookDto.description) {
            book.description = updateBookDto.description;
        }

        if (updateBookDto.author) {
            book.author = updateBookDto.author;
        }

        Object.assign(book, updateBookDto);
        return this.bookRepository.save(book);
    }

    async delete(id: number): Promise<void> {
        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Book not found');
        }
    }

    async findByCategoryAndSubcategories(categoryId: number): Promise<GetBooksByCategoryDto[]> {
        const category = await this.categoriesService.findOne(categoryId);
        const subcategoryIds = await this.categoriesService.getAllSubcategoryIdsRecursively(categoryId);

        const books = await this.bookRepository.find({
            where: [{ category }, ...subcategoryIds.map(id => ({ category: { id } }))],
            relations: ['category'],
        });

        return books.map(book => ({
            id: book.id,
            name: book.name,
            author: book.author,
            categoryId: book.category.id,
            description: book.description,
        }));
    }

    async getCategoryBreadcrumb(categoryId: number): Promise<string> {
        let breadcrumb = '';
        let categoryIdCurrent: number | undefined = categoryId;

        while (categoryIdCurrent !== undefined) {
            const category = await this.categoriesService.findOne(categoryIdCurrent);
            if (!category) {
                break;
            }

            breadcrumb = `${category.name}${breadcrumb ? ' > ' + breadcrumb : ''}`;

            if (category.parentCategoryId === null || category.parentCategoryId === undefined) {
                break;
            }

            categoryIdCurrent = category.parentCategoryId;
        }

        return breadcrumb;
    }
}
