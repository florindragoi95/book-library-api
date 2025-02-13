import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./book.entity";
import { GetBookWithBreadcrumbDto } from "./dto/get-book-with-breadcrumb.dto";
import {ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery} from '@nestjs/swagger';
import {GetBooksByCategoryDto} from "./dto/get-books-by-category.dto";
import {PaginationDto} from "./dto/pagination.dto";

@ApiTags('books')
@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({ status: 201, description: 'The book has been successfully created.', type: Book })
    @ApiResponse({ status: 400, description: 'Invalid request data' })
    @ApiResponse({ status: 409, description: 'Book name already exists' })
    async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.booksService.create(createBookDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all books' })
    @ApiResponse({ status: 200, description: 'List of all books', type: [Book] })
    async findAll(): Promise<Book[]> {
        return this.booksService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a book with breadcrumb by ID' })
    @ApiResponse({ status: 200, description: 'The found book with breadcrumb', type: GetBookWithBreadcrumbDto })
    @ApiResponse({ status: 404, description: 'Book not found' })
    async getBookWithBreadcrumb(@Param('id', ParseIntPipe) id: number): Promise<GetBookWithBreadcrumbDto> {
        return this.booksService.findOneWithBreadcrumb(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a book by ID' })
    @ApiBody({ type: UpdateBookDto })  // Documents the body of the request
    @ApiResponse({ status: 200, description: 'The updated book', type: Book })
    @ApiResponse({ status: 400, description: 'Invalid request data' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    @ApiResponse({ status: 409, description: 'Book name already exists' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookDto: UpdateBookDto,
    ): Promise<Book> {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a book by ID' })
    @ApiResponse({ status: 200, description: 'The book has been successfully deleted' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.booksService.delete(id);
    }

    @Get('/category/:categoryId')
    @ApiOperation({ summary: 'Get books by category and its subcategories' })
    @ApiResponse({ status: 200, description: 'List of books in the category', type: [GetBooksByCategoryDto] })
    @ApiQuery({
        name: 'skip',
        description: 'Number of books to skip (for pagination)',
        required: false,
        type: Number,
        example: 0,
    })
    @ApiQuery({
        name: 'limit',
        description: 'Number of books to return (limit the results)',
        required: false,
        type: Number,
        example: 10,
    })
    async getBooksByCategoryAndSubcategories (
        @Param('categoryId', ParseIntPipe) categoryId: number,
        @Query() paginationDto: PaginationDto
    ): Promise<GetBooksByCategoryDto[]> {
        return this.booksService.findByCategoryAndSubcategories(categoryId, paginationDto);
    }
}
