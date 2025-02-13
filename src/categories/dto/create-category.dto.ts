import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ description: 'The name of the category' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'The parent category ID (if this category is a subcategory)' })
    @IsInt()
    @IsOptional()
    parentCategoryId?: number;
}
