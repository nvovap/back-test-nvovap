import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Albums} from "../entity/Albums";
import { getCurrenUserFromToken } from "../_help/auth"

/**
 * Change albums title
 * localhost:3000/change-album-title?albumid=2&new_album_name=Vova
 * Headers
 * authorization : Bearer tocken
 */
export async function ChangeAlbumTitle(request: Request, response: Response) {

    const owner = await getCurrenUserFromToken(request);
    

    const idAlbum = Number(request.query.albumid);
    const new_album_name = String(request.query.new_album_name);
    let album = null;
    
    if (idAlbum && new_album_name) {
        const albumsRepository = getManager().getRepository(Albums);
        album = await albumsRepository.findOne({ where: {owner: owner.id, idAlbum} });

        if (!album) {
            response.status(400).json({ message: "Album not found" });
            response.end();
            return;  
        }

        album.title = new_album_name;

        await getManager().save(album);
    }

    if (album) {
        response.send(album);
    } else {
        response.status(400);
        response.end();
    }
}