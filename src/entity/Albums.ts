import { Entity, ObjectID, ObjectIdColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Albums {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    idAlbum: number

    @ManyToOne(type => User)
    owner: ObjectID

    @Column()
    title: string


    constructor(id: number, owner: User, title: string) {
        this.idAlbum = id
        if (owner) this.owner = owner.id
        this.title = title
    }

}

