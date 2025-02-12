import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsOptional()
    parentCategoryId?: number;
}
