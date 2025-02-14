import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Book} from "./books/book.entity";
import {Category} from "./categories/category.entity";
import {DataSource} from "typeorm";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT!, 10),
      username: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
      entities: [Book, Category],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    TypeOrmModule.forFeature([Book, Category]),
    BooksModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(private dataSource: DataSource) {}

}
