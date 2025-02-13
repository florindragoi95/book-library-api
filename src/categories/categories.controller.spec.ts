import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  const mockCategory: Category = {
    id: 1,
    name: 'Fiction',
    parentCategoryId: null,
    books: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCategory),
            findAll: jest.fn().mockResolvedValue([mockCategory]),
            findOne: jest.fn().mockResolvedValue(mockCategory),
            update: jest.fn().mockResolvedValue(mockCategory),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    categoriesController = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Fiction' };
      await expect(categoriesController.create(createCategoryDto)).resolves.toEqual(mockCategory);
      expect(categoriesService.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      await expect(categoriesController.findAll()).resolves.toEqual([mockCategory]);
      expect(categoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      await expect(categoriesController.findOne(1)).resolves.toEqual(mockCategory);
      expect(categoriesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Science Fiction' };
      await expect(categoriesController.update(1, updateCategoryDto)).resolves.toEqual(mockCategory);
      expect(categoriesService.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      await expect(categoriesController.remove(1)).resolves.toBeUndefined();
      expect(categoriesService.delete).toHaveBeenCalledWith(1);
    });
  });
});
