import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { CategoriesService } from '../categories/categories.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';
import {NotFoundException, ConflictException} from '@nestjs/common';
import {Category} from "../categories/category.entity";
import {CreateBookDto} from "./dto/create-book.dto";
import {GetBooksByCategoryDto} from "./dto/get-books-by-category.dto";
import {PaginationDto} from "./dto/pagination.dto";
import {DEFAULT_PAGE_SIZE} from "./utils/constants";

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;
  let categoriesService: CategoriesService;

  const mockCategory = {
    id: 1,
    name: 'Fiction',
    parentCategoryId: null
  } as Category;

  const mockBook = {
    id: 1,
    name: 'Dune',
    author: 'Frank Herbert',
    category: mockCategory,
    description: 'Sci-Fi novel'
  } as Book;

  const paginationDto = { skip: 0, limit: 10 } as PaginationDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: CategoriesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCategory),
            getAllSubcategoryIdsRecursively: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(mockBook),
            save: jest.fn().mockResolvedValue(mockBook),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new book', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockBook);
      jest.spyOn(repository, 'save').mockResolvedValue(mockBook);

      expect(await service.create({ name: 'Dune', author: 'Frank Herbert', categoryId: 1, description: 'Sci-Fi novel' }))
          .toEqual(mockBook);
    });

    it('should throw an error if book name already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockBook);
      await expect(service.create({ name: 'Dune', author: 'Frank Herbert', categoryId: 1 }))
          .rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const mockCreateBookDto = {
        name: "Everything About second war",
        author: "Frank Peter",
        categoryId: 2
      } as CreateBookDto

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(categoriesService, 'findOne').mockRejectedValue(new NotFoundException(`Category with ID ${mockCreateBookDto.categoryId} not found.`));
      await expect(service.create(mockCreateBookDto))
          .rejects.toThrow(NotFoundException);
    });

  });

  describe('findAll', () => {
    it('should return all books', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockBook]);
      expect(await service.findAll()).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockBook);
      expect(await service.findOne(1)).toEqual(mockBook);
    });

    it('should throw an error if book not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockBook, name: 'Dune Messiah' });
      expect(await service.update(1, { name: 'Dune Messiah' }))
          .toEqual({ id: 1, name: 'Dune Messiah', author: 'Frank Herbert', category: mockCategory, description: 'Sci-Fi novel' });
    });

    it('should throw error if new name already exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id: 2, name: 'Dune Messiah', author: 'Frank Herbert', category: mockCategory });
      await expect(service.update(1, { name: 'Dune Messiah' })).rejects.toThrow(ConflictException);
    });

    it('should throw error if category ID is invalid', async () => {
      const invalidCategoryId = 999;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(categoriesService, 'findOne').mockResolvedValueOnce(null as any);

      await expect(service.update(1, { categoryId: invalidCategoryId }))
          .rejects.toThrowError(new NotFoundException(`Category with ID ${invalidCategoryId} not found.`));
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);
      await expect(service.delete(1)).resolves.toBeUndefined();
    });

    it('should throw an error if book not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneWithBreadcrumb', () => {
    it('should return book with breadcrumbs', async () => {
      const mockBreadcrumbs = [
          "Fantasy > High Fantasy > Epic Fantasy > Gothic Fiction",
          "Fantasy > Urban Fantasy > Modern Era"
      ];

      const mockBookWithBreadcrumb = {
        id: 1,
        name: 'Dune Messiah',
        author: 'Frank Herbert',
        description: 'Sci-Fi novel',
        categoryId: mockCategory.id,
        breadcrumbs: mockBreadcrumbs,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(service, 'getCategoryBreadcrumbs').mockResolvedValue(mockBreadcrumbs);

      const result = await service.findOneWithBreadcrumb(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.getCategoryBreadcrumbs).toHaveBeenCalledWith(mockCategory.id);
      expect(result).toEqual(mockBookWithBreadcrumb);
    });

    it('should throw NotFoundException if category is not found for the book', async () => {
      const mockBookWithoutCategory = {
        id: 1,
        name: 'Dune',
        author: 'Frank Herbert',
        description: 'Sci-Fi novel',
      } as Book;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockBookWithoutCategory);

      await expect(service.findOneWithBreadcrumb(1))
          .rejects
          .toThrow(new NotFoundException('Category not found for the book'));
    });
  });

  describe('findByCategoryAndSubcategories', () => {
    it('should return books for a given category and its subcategories', async () => {
      const categoryId = 1;
      const mockCategory = {
        id: categoryId,
        name: 'Science Fiction',
        books: [],
      } as Category;
      const mockSubcategoryIds = [2, 3];

      const mockBooks = [
        { id: 1, name: 'Dune', author: 'Frank Herbert', category: mockCategory, description: 'Sci-Fi novel' } as Book,
        { id: 2, name: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', category: mockCategory, description: 'Sci-Fi novel' } as Book,
      ];

      const mockBooksByCategoryDto = [
        { id: 1, name: 'Dune', author: 'Frank Herbert', categoryId: categoryId, description: 'Sci-Fi novel' } as GetBooksByCategoryDto,
        { id: 2, name: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', categoryId: categoryId, description: 'Sci-Fi novel' } as GetBooksByCategoryDto,
      ];

      jest.spyOn(categoriesService, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(categoriesService, 'getAllSubcategoryIdsRecursively').mockResolvedValue(mockSubcategoryIds);
      jest.spyOn(repository, 'find').mockResolvedValue(mockBooks);

      const result = await service.findByCategoryAndSubcategories(categoryId, paginationDto);

      expect(categoriesService.findOne).toHaveBeenCalledWith(categoryId);
      expect(categoriesService.getAllSubcategoryIdsRecursively).toHaveBeenCalledWith(categoryId);
      expect(repository.find).toHaveBeenCalledWith({
        where: [{ category: mockCategory }, ...mockSubcategoryIds.map(id => ({ category: { id } }))],
        relations: ['category'],
        skip: paginationDto.skip,
        take: paginationDto.limit ?? DEFAULT_PAGE_SIZE
      });
      expect(result).toEqual(mockBooksByCategoryDto);
    });

    it('should throw NotFoundException if category is not found', async () => {
      const invalidCategoryId = 999;
      jest.spyOn(categoriesService, 'findOne').mockRejectedValueOnce(new NotFoundException(`Category with ID ${invalidCategoryId} not found.`));
      await expect(service.findByCategoryAndSubcategories(invalidCategoryId, paginationDto))
          .rejects
          .toThrowError(new NotFoundException(`Category with ID ${invalidCategoryId} not found.`));
    });
  });

});
