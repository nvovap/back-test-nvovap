import { Request, Response } from "express";
import { getCurrenUserFromToken } from "../_help/auth"
import * as axios from "axios"

import { Albums } from "../entity/Albums";
import { Photo }  from "../entity/Photo";
import { User }   from "../entity/User";

import { getManager } from "typeorm"


async function getAlbums(id: number, owner: User, title: string) {
    const manager = getManager();
    const repository = manager.getRepository(Albums);

    let album = await repository.findOne({idAlbum: id, owner: owner.id});
    if (!album) {
        album = new Albums(id, owner, title);
        await manager.save(album);
    }

    return album;
}
/**
 * Loads all photos from the database.
 * localhost:3000/load-photos
 * Headers
 * authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MjQ5NjA4OTBiOGNjNjIzZjhmYTEzYWUiLCJpYXQiOjE2NDg5NzYwNDQsImV4cCI6MTY0OTA2MjQ0NH0.Cynzz4sodfDtBMlAO5L0Oo440DfiW5Nc_VjB_-ZP5R0
 */
export async function LoadPhotos(request: Request, response: Response) {


    const currentUser = await getCurrenUserFromToken(request);
    
    interface PhotoFromSite {
        id: number;
        albumId: number;
        title: string;
        url: string;
        thumbnailUrl: string;
    }
    
    const photosFromSite: [PhotoFromSite] = await (await axios.default.get("https://jsonplaceholder.typicode.com/photos")).data
    
    for (let i = 0; i <  photosFromSite.length; i++) {
        const foto = photosFromSite[i];
        const manager = getManager();

        const album = await getAlbums(foto.albumId, currentUser, String(foto.albumId));
        const photo = new Photo(foto.id, currentUser, album, foto.title, foto.url, foto.thumbnailUrl);

        await manager.save(photo);
    }
 
    response.send("ok");
}