import {Request, Response} from "express";
import {getManager, FindOperator } from "typeorm";
import {Photo} from "../entity/Photo";
import { getCurrenUserFromToken } from "../_help/auth"
import { Albums } from "../entity/Albums";

/**
 * Delete  albums and photos from the database.
 * localhost:3000/delete-album?albumid=1,2,3
 * Headers
 * authorization : Bearer tocken
 */
export async function DeleteAlbum(request: Request, response: Response) {

    const owner = await getCurrenUserFromToken(request);

    if (!owner) {
        response.status(400).json({ message: "ownerid is incorrect" });
        response.end();
        return;
    }

    const albumsRepository = getManager().getRepository(Albums);
    const photoRepository = getManager().getRepository(Photo);

    const albumids = String(request.query.albumid ? request.query.albumid : "").split(',');

    const paramAlbumIDs  = albumids.flatMap(el => Number(el))

    const albums = await albumsRepository.find({where: { owner: owner.id,  idAlbum: { $in: paramAlbumIDs }}});

    const albumIDs = albums.flatMap(el => el.id)

    const photos = await photoRepository.find({where: { owner: owner.id,  album: {$in: albumIDs}}});

    photos.forEach(elPhoto  => photoRepository.delete(elPhoto.id));
    albums.forEach(elAlbums => albumsRepository.delete(elAlbums.id));

    // return removed photos and albums
    let allElements: Array<Albums | Photo> = albums;
    allElements = allElements.concat(photos);

    response.send(allElements);
}