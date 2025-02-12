import {forwardRef, Module} from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import {CategoriesModule} from "../categories/categories.module";
import {Book} from "./book.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    controllers: [BooksController],
    providers: [BooksService],
    exports: [BooksService],
    imports: [forwardRef(() => CategoriesModule), TypeOrmModule.forFeature([Book])],

})
export class BooksModule {}
