import {Module} from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import {CategoriesModule} from "../categories/categories.module";
import {DatabaseModule} from "../database/database.module";

@Module({
    controllers: [BooksController],
    providers: [BooksService],
    exports: [BooksService],
    imports: [CategoriesModule, DatabaseModule],

})
export class BooksModule {}
