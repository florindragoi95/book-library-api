import {IsNumber, IsOptional, IsPositive, Min} from "class-validator";
import {Transform} from "class-transformer";

export class PaginationDto {

    @IsNumber()
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    skip: number = 0;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    limit: number = 10;
}
