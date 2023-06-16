import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { USER_STATUS_ACTIVE } from "../shared/constants/user-status";
import { USERNAME_MAX_LENGTH } from "../shared/constants/register-auth";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ length: USERNAME_MAX_LENGTH > 100 ? USERNAME_MAX_LENGTH : 100 })
  username: string;

  @Column({
    select: false,
    length: 200,
  })
  password: string;

  @Index()
  @Column({
    name: "status_id",
    default: USER_STATUS_ACTIVE,
  })
  statusId: number;

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
