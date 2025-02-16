import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {DatabaseService} from "../database/database.service";
import {Prisma} from "@generated/client";

@Injectable()
export class CategoriesService {

    constructor(private readonly databaseService: DatabaseService) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Prisma.CategoryGetPayload<{}>> {
        const existingCategory = await this.databaseService.category.findUnique({
            where: { name: createCategoryDto.name },
        });
        if (existingCategory) {
            throw new ConflictException('Category name already exists.');
        }

        if(createCategoryDto.parentCategoryId) {
            await this.findOne(createCategoryDto.parentCategoryId);
        }

        return this.databaseService.category.create({
            data: {
                name: createCategoryDto.name,
                parentCategoryId: createCategoryDto.parentCategoryId ?? null,
            },
        });
    }

    async findAll(): Promise<Prisma.CategoryGetPayload<{}>[]> {
        return this.databaseService.category.findMany();
    }

    async findOne(id: number): Promise<Prisma.CategoryGetPayload<{}>>  {
        const category = await this.databaseService.category.findUnique({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Prisma.CategoryGetPayload<{}>> {
        const category = await this.findOne(id);

        if (updateCategoryDto.name) {
            const existingCategory = await this.databaseService.category.findUnique({
                where: { name: updateCategoryDto.name },
            });

            if (existingCategory && existingCategory.id !== id) {
                throw new ConflictException('Category name already exists.');
            }
        }

        if(updateCategoryDto.parentCategoryId) {
            if (updateCategoryDto.parentCategoryId === id) {
                throw new BadRequestException("A category cannot be its own parent.");
            }
            await this.findOne(updateCategoryDto.parentCategoryId);
        }

        const { name, parentCategoryId } = updateCategoryDto;

        return this.databaseService.category.update({
            where: { id },
            data: {
                name,
                parentCategoryId: parentCategoryId ?? null,
            },
        });
    }

    async delete(id: number): Promise<void> {
        await this.findOne(id);
        await this.databaseService.category.updateMany({
            where: { parentCategoryId: id },
            data: { parentCategoryId: null },
        });

        await this.databaseService.category.delete({ where: { id } });
    }

    async getSubcategories(parentId: number): Promise<Prisma.CategoryGetPayload<{}>[]> {
        return this.databaseService.category.findMany({ where: { parentCategoryId: parentId } });
    }

    async getAllSubcategoryIdsRecursively(parentId: number): Promise<number[]> {
        let subcategoryIds: number[] = [];
        const subcategories = await this.getSubcategories(parentId);

        for (const sub of subcategories) {
            subcategoryIds.push(sub.id);
            subcategoryIds = subcategoryIds.concat(await this.getAllSubcategoryIdsRecursively(sub.id));
        }
        return subcategoryIds;
    }
}
