import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {

    @ApiProperty({ description: 'The name of the book' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The author of the book' })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({ description: 'The category ID of the book' })
    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @ApiProperty({ description: 'The description of the book', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
