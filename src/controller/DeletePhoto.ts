import {Request, Response} from "express";
import { User } from "../entity/User";
import {getManager} from "typeorm";
import {Photo} from "../entity/Photo";
import { getCurrenUserFromToken } from "../_help/auth"

/**
 * Delete  photos from the database.
 * localhost:3000/delete-photo?photoid=1,2,3
 * Headers
 * authorization : Bearer tocken
 */
export async function DeletePhoto(request: Request, response: Response) {

    const owner = await getCurrenUserFromToken(request);

    if (!owner) {
        response.status(400).json({ message: "ownerid is incorrect" });
        response.end();
        return;
    }

    const photoRepository = getManager().getRepository(Photo);

    const photoids = String(request.query.photoid ? request.query.photoid : "").split(',');

    const paramPhotoIDs  = photoids.flatMap(el => Number(el))


    const photos = await photoRepository.find({where: { owner: owner.id,  idPhoto: {$in: paramPhotoIDs}}});

    photos.forEach(elPhoto => photoRepository.delete(elPhoto.id));

    // return loaded photos
    response.send(photos);
}