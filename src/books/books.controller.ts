import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {BooksService} from "./books.service";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {Book} from "./book.entity";
import {GetBookWithBreadcrumbDto} from "./dto/get-book-with-breadcrumb.dto";

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Post()
    async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.booksService.create(createBookDto);
    }

    @Get()
    async findAll(): Promise<Book[]> {
        return this.booksService.findAll();
    }

    @Get(':id')
    async getBookWithBreadcrumb(@Param('id', ParseIntPipe) id: number): Promise<GetBookWithBreadcrumbDto> {
        return this.booksService.findOneWithBreadcrumb(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookDto: UpdateBookDto,
    ): Promise<Book> {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.booksService.delete(id);
    }

    @Get('/category/:categoryId')
    async getBooksByCategoryAndSubcategories (@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Book[]> {
        return this.booksService.findByCategoryAndSubcategories(categoryId);
    }

}
