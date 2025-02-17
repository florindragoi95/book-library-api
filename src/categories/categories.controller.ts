import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {Prisma} from "@generated/client";
import {CreateCategoryResponseDto} from "./dto/create-category-response.dto";
import {CategoryResponseDto} from "./dto/category-response.dto";
import {UpdateCategoryResponseDto} from "./dto/update-category-response.dto";

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category successfully created', type: CreateCategoryResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid request data' })
    @ApiResponse({ status: 409, description: 'Category name already exists' })
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all categories' })
    @ApiResponse({ status: 200, description: 'List of all categories', type: [CategoryResponseDto] })
    async findAll(): Promise<CategoryResponseDto[]> {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ status: 200, description: 'Category found', type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a category' })
    @ApiResponse({ status: 200, description: 'Category successfully updated', type: UpdateCategoryResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid request data' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiResponse({ status: 409, description: 'Category name already exists' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<UpdateCategoryResponseDto> {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category' })
    @ApiResponse({ status: 204, description: 'Category successfully deleted' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.categoriesService.delete(id);
    }
}
