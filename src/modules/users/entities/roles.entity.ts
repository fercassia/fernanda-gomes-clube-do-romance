import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('roles')
export class RolesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 7, nullable:false, unique:true})
    description: string
}