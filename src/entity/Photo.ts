import { Entity, ObjectID, ObjectIdColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Albums } from "./Albums"
import { User } from "./User"

@Entity()
export class Photo {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    idPhoto: number


    @ManyToOne(type => User)
    owner: ObjectID
    
    @ManyToOne(type => Albums)
    album: ObjectID

    @Column()
    title: string

    @Column()
    url: string

    @Column()
    thumbnailUrl: string

    constructor(id: number, owner: User, album: Albums, title: string, url: string, thumbnailUrl: string ) {
        this.idPhoto = id
        if (owner) this.owner = owner.id
        if (album) this.album = album.id
        this.title = title
        this.url = url
        this.thumbnailUrl = thumbnailUrl
    }

   
}