
import { UsersEntity } from "../../users/entities/users.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, Index} from "typeorm"

@Entity('attempts_blocked')
@Index(['id', 'createdAt'])
export class AttemptsBlockedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersEntity,  {eager: true, nullable:false})
    @JoinColumn({ name: "user_id" })
    userId: UsersEntity

    @Column({length: 1, nullable:false, default: 0})
    attempts: number;

    @Column({nullable:false, default: false})
    isBlocked: boolean;

    @CreateDateColumn({name: "last_attempt_at", nullable: false})
    lastAttemptAt: Date;
}
