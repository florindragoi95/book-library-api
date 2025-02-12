import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
      password: process.env.DATABASE_PASSWORD!,   // your PostgreSQL password
      database: process.env.DATABASE_NAME!,       // your PostgreSQL database name
      entities: [Book, Category], //['dist/**/*.entity{.ts,.js}']
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book, Category]),
    BooksModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  constructor(private dataSource: DataSource) {}

}
