import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('verification_codes')
@Index(['id', 'createdAt'])
export class VerificationCodesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  userId: UsersEntity;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: false,
    unique: true,
    name: 'cod_activation',
  })
  codActivation: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}