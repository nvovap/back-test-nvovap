import { Entity, ObjectID, ObjectIdColumn, Column, OneToMany } from "typeorm"
import { Albums } from "./Albums"

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    login: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    registerDate: Date

    //@OneToMany(type => Albums, albums => albums.owner, { cascadeInsert: true })
    //albums: Albums[]
}