import {forwardRef, Module} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {BooksModule} from "../books/books.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./category.entity";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
  imports: [forwardRef(() => BooksModule), TypeOrmModule.forFeature([Category])],

})
export class CategoriesModule {}
