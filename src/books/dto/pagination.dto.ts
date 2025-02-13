import {IsNumber, IsOptional, IsPositive, Min} from "class-validator";
import {Transform} from "class-transformer";

export class PaginationDto {

    @IsNumber()
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    skip: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    limit: number;
}
