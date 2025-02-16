import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { GetBookWithBreadcrumbDto } from './dto/get-book-with-breadcrumb.dto';
import { Category } from '../categories/entities/category.entity';
import {PaginationDto} from "./dto/pagination.dto";

describe('BooksController', () => {
  let booksController: BooksController;
  let booksService: BooksService;

  const mockCategory: Category = {
    id: 1,
    name: 'Fiction',
    parentCategoryId: null,
    books: [],
  };

  const mockSubcategory: Category = {
    id: 2,
    name: 'Science Fiction',
    parentCategoryId: 1,
    books: [],
  };

  const mockBook: Book = {
    id: 1,
    name: 'Dune',
    author: 'Frank Herbert',
    category: mockSubcategory,
    description: 'A sci-fi classic',
  };

  const mockBreadcrumbs = [
    "Fiction > Science Fiction",
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBook),
            findAll: jest.fn().mockResolvedValue([mockBook]),
            findOneWithBreadcrumb: jest.fn().mockResolvedValue(
                {
                  id: mockBook.id,
                  name: mockBook.name,
                  author: mockBook.author,
                  description: mockBook.description,
                  categoryId: mockBook.category.id,
                  breadcrumbs: mockBreadcrumbs,
                } as GetBookWithBreadcrumbDto
            ),
            update: jest.fn().mockResolvedValue(mockBook),
            delete: jest.fn().mockResolvedValue(undefined),
            findByCategoryAndSubcategories: jest.fn().mockResolvedValue([mockBook]),
          },
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  it('should create a book', async () => {
    const createBookDto: CreateBookDto = {
      name: 'Dune',
      author: 'Frank Herbert',
      categoryId: mockSubcategory.id,
      description: 'A sci-fi classic',
    };
    await expect(booksController.create(createBookDto)).resolves.toEqual(mockBook);
  });

  it('should retrieve all books', async () => {
    await expect(booksController.findAll()).resolves.toEqual([mockBook]);
  });

  it('should retrieve a book with breadcrumb', async () => {
    await expect(booksController.getBookWithBreadcrumb(1)).resolves.toEqual( {
      id: mockBook.id,
      name: mockBook.name,
      author: mockBook.author,
      description: mockBook.description,
      categoryId: mockBook.category.id,
      breadcrumbs: mockBreadcrumbs,
    });
  });

  it('should update a book', async () => {
    const updateBookDto: UpdateBookDto = { name: 'Dune Updated' };
    await expect(booksController.update(1, updateBookDto)).resolves.toEqual(mockBook);
  });

  it('should delete a book', async () => {
    await expect(booksController.remove(1)).resolves.toBeUndefined();
  });

  it('should retrieve books by category and subcategories with pagination', async () => {
    const paginationDto = { skip: 0, limit: 10 } as PaginationDto;
    await expect(booksController.getBooksByCategoryAndSubcategories(mockCategory.id, paginationDto)).resolves.toEqual([mockBook]);
  });
});
