
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, Index} from "typeorm"
import { TypeUsersEntity } from "./typeUsers.entity"

@Entity('users')
@Index(['email'], { unique: true })
@Index(['displayName'], { unique: true })
@Index(['id','createdAt'])
export class UsersEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 70, nullable:false, unique:true, name: "display_name"})
    displayName: string

    @Column({length: 100, unique:true, nullable:false})
    email: string;

    @ManyToOne(() => TypeUsersEntity,  {eager: true, nullable:false})
    @JoinColumn({ name: "role_id" })
    role: TypeUsersEntity

    @Column({length: 70, nullable:false})
    password: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @Column({type: "boolean", default: false, nullable:false})
    isActive: boolean;
}
