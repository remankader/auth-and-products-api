import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    name: "user_id",
    type: "int",
  })
  userId: number;

  @Column({
    name: "refresh_token",
    length: 512,
  })
  refreshToken: string;

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
