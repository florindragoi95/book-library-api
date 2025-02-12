import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    author: string;

    @Column()
    categoryId: number;

    @Column({ nullable: true })
    description?: string;
}
