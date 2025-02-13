import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBookWithBreadcrumbDto {

    @ApiProperty({ description: 'The ID of the book' })
    @IsInt()
    id: number;

    @ApiProperty({ description: 'The name of the book' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The author of the book' })
    @IsString()
    author: string;

    @ApiProperty({ description: 'The category ID of the book' })
    @IsInt()
    categoryId: number;

    @ApiProperty({ description: 'A brief description of the book', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Breadcrumb for navigating to the book' })
    @IsString()
    breadcrumb: string;
}
