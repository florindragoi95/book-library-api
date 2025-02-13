import {CreateBookDto} from "./create-book.dto";
import { PartialType } from "@nestjs/mapped-types";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateBookDto extends PartialType(CreateBookDto) {

    @ApiProperty({ description: 'The name of the book', required: false })
    name?: string;

    @ApiProperty({ description: 'The author of the book', required: false })
    author?: string;

    @ApiProperty({ description: 'The category ID of the book', required: false })
    categoryId?: number;

    @ApiProperty({ description: 'The description of the book', required: false })
    description?: string;

}
