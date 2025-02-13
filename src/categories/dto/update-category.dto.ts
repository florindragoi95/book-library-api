import { CreateCategoryDto } from "./create-category.dto";
import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

    @ApiPropertyOptional({ description: 'The updated category name' })
    name?: string;

    @ApiPropertyOptional({ description: 'The updated parent category ID' })
    parentCategoryId?: number;

}
