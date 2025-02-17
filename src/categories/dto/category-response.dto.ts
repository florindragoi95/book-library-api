import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class CategoryResponseDto {

    @ApiProperty({ description: 'The ID of the category' })
    id: number;

    @ApiProperty({ description: 'The name of the category' })
    name: string;

    @ApiPropertyOptional({ description: 'The parent category ID (if this category is a subcategory)' })
    parentCategoryId?: number;

}
