
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm"

@Entity()
export class UsersEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length: 70, nullable:false, unique:true, name: "display_name"})
    displayName: string

    @Column({length: 100, unique:true, nullable:false})
    email: string;

    @Column({default: "user", length: 6, nullable:false})
    role: string

    @Column({length: 20, nullable:false})
    password: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;
}
