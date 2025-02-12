import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CategoriesService} from "../categories/categories.service";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {Book} from "./book.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {GetBookWithBreadcrumbDto} from "./dto/get-book-with-breadcrumb.dto";

@Injectable()
export class BooksService {

    constructor(
        @Inject(forwardRef(() => CategoriesService))
        private readonly categoriesService: CategoriesService,

        @InjectRepository(Book)
        private bookRepository: Repository<Book>,

    ) {}

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const existingBook = await this.bookRepository.findOne({ where: { name: createBookDto.name } });
        if (existingBook) {
            throw new BadRequestException('Book name already exists.');
        }

        const newBook = this.bookRepository.create(createBookDto);
        return this.bookRepository.save(newBook);
    }

    async findAll(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    async findOne(id: number): Promise<Book> {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    }

    async findOneWithBreadcrumb(id: number): Promise<GetBookWithBreadcrumbDto> {
        const book = await this.findOne(id);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        const breadcrumb = await this.getCategoryBreadcrumb(book.categoryId);

        return {
            ...book,
            breadcrumb,
        };
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
        const book = await this.findOne(id);

        if (updateBookDto.name) {
            const existingBook = await this.bookRepository.findOne({ where: { name: updateBookDto.name } });
            if (existingBook && existingBook.id !== id) {
                throw new BadRequestException('Book name already exists.');
            }
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

    async deleteByCategory(categoryId: number): Promise<void> {
        await this.bookRepository.delete({ categoryId });
    }

    async findByCategoryAndSubcategories(categoryId: number): Promise<Book[]> {
        const subcategoryIds = await this.categoriesService.getAllSubcategoryIdsRecursively(categoryId);
        return this.bookRepository.find({
            where: [{ categoryId }, ...subcategoryIds.map(id => ({ categoryId: id }))],
        });
    }

    private async getCategoryBreadcrumb(categoryId: number): Promise<string> {
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
