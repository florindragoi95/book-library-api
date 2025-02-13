import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategory = {
    id: 1,
    name: 'Fiction',
    parentCategoryId: null
  } as Category;

  const mockSubcategory = {
    id: 2,
    name: 'Sci-Fi',
    parentCategoryId: 1
  } as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(mockCategory),
            save: jest.fn().mockResolvedValue(mockCategory),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockCategory);
      jest.spyOn(repository, 'save').mockResolvedValue(mockCategory);
      expect(await service.create({ name: 'Fiction' })).toEqual(mockCategory);
    });

    it('should throw error if category name exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategory);
      await expect(service.create({ name: 'Fiction' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockCategory]);
      expect(await service.findAll()).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategory);
      expect(await service.findOne(1)).toEqual(mockCategory);
    });

    it('should throw error if category not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockCategory, name: 'Science Fiction' });
      expect(await service.update(1, { name: 'Science Fiction' }))
          .toEqual({ id: 1, name: 'Science Fiction', parentCategoryId: null });
    });

    it('should throw error if new name already exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSubcategory);
      await expect(service.update(1, { name: 'Sci-Fi' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await expect(service.delete(1)).resolves.toBeUndefined();

      expect(repository.update).toHaveBeenCalledWith({ parentCategoryId: 1 }, { parentCategoryId: null });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if category is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Category not found'));

      await expect(service.delete(999)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getAllSubcategoryIdsRecursively', () => {
    it('should return all subcategory ids recursively', async () => {
      jest.spyOn(repository, 'find')
          .mockResolvedValueOnce([
            { id: 2, parentCategoryId: 1, name: 'Subcategory 1', books: [] },
          ])
          .mockResolvedValueOnce([]);

      expect(await service.getAllSubcategoryIdsRecursively(1)).toEqual([2]);
    });
  });
});
