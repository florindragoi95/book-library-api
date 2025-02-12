import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Book} from "../books/book.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    parentCategoryId?: number;

    @OneToMany(() => Book, (book) => book.category, { cascade: ['remove'] })
    books: Book[];

    // @OneToMany(() => Category, (category) => category.parentCategoryId)
    // subcategories: Category[];

}
