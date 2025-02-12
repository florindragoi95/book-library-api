import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {Category} from "../categories/category.entity";

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    author: string;

    @ManyToOne(() => Category, (category) => category.books, { onDelete: 'CASCADE' })
    category: Category;

    @Column({ nullable: true })
    description?: string;
}
