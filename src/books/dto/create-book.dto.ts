import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @IsString()
    @IsOptional()
    description?: string;
}
