import { IsString, IsInt, IsOptional } from 'class-validator';

export class GetBookWithBreadcrumbDto {

    @IsInt()
    id: number;

    @IsString()
    name: string;

    @IsString()
    author: string;

    @IsInt()
    categoryId: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    breadcrumb: string;
}
