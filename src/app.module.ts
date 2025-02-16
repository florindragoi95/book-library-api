import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import {DatabaseModule} from "./database/database.module";

@Module({
  imports: [
    BooksModule,
    CategoriesModule,
    DatabaseModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
