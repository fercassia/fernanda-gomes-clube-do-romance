import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('type_users')
export class TypeUsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 7, nullable:false, unique:true})
    description: string
}