import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Book} from "../../books/entities/book.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'parentcategoryid', nullable: true, type: "int" })
    parentCategoryId?: number | null;

    @OneToMany(() => Book, (book) => book.category, { cascade: ['remove'] })
    books: Book[];

}
