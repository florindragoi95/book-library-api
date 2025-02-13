import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./category.entity";
import {Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
        if (existingCategory) {
            throw new ConflictException('Category name already exists.');
        }

        const newCategory = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(newCategory);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        if (updateCategoryDto.name) {
            const existingCategory = await this.categoryRepository.findOne({ where: { name: updateCategoryDto.name } });
            if (existingCategory && existingCategory.id !== id) {
                throw new ConflictException('Category name already exists.');
            }
        }

        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }

    async delete(id: number): Promise<void> {
        await this.findOne(id);
        await this.categoryRepository.update({ parentCategoryId: id }, { parentCategoryId: null });
        await this.categoryRepository.delete(id);
    }

    async getAllSubcategoryIdsRecursively(parentId: number): Promise<number[]> {
        let subcategoryIds: number[] = [];
        const subcategories = await this.categoryRepository.find({ where: { parentCategoryId: parentId } });

        for (const sub of subcategories) {
            subcategoryIds.push(sub.id);
            subcategoryIds = subcategoryIds.concat(await this.getAllSubcategoryIdsRecursively(sub.id));
        }
        return subcategoryIds;
    }
}
