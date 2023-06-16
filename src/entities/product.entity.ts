import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({
    name: "category_id",
    type: "int",
  })
  categoryId: number;

  @Column("decimal", { precision: 6, scale: 2 })
  price: number;

  @Column({
    name: "status_id",
    type: "int",
  })
  statusId: number;

  @Column({
    name: "user_id",
    type: "int",
  })
  userId: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
  })
  updatedAt: Date;
}
