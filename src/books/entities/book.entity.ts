import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import {Category} from "../../categories/entities/category.entity";

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    author: string;

    @ManyToOne(() => Category, (category) => category.books, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryid' })
    category: Category;

    @Column({ nullable: true })
    description?: string;
}
