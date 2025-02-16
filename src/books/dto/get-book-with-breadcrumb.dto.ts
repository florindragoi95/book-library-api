import { ApiProperty } from '@nestjs/swagger';

export class GetBookWithBreadcrumbDto {

    @ApiProperty({ description: 'The ID of the book' })
    id: number;

    @ApiProperty({ description: 'The name of the book' })
    name: string;

    @ApiProperty({ description: 'The author of the book' })
    author: string;

    @ApiProperty({ description: 'The category ID of the book' })
    categoryId: number;

    @ApiProperty({ description: 'A brief description of the book', required: false })
    description?: string;

    @ApiProperty({ description: 'A list of breadcrumb strings showing the category path to the book, starting from the top-level category and including all nested subcategories, separated by ">".'  })
    breadcrumbs: string[];
}
