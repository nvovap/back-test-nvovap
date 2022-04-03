import {Request, Response} from "express";
import { User } from "../entity/User";
import {getManager} from "typeorm";
import {Photo} from "../entity/Photo";
import { getCurrenUserFromToken } from "../_help/auth"

/**
 * Loads  photos from the database.
 * localhost:3000/get-photos?page=0&maxcount=10&ownerid=6249506d5e98372320b3d6e5
 * localhost:3000/get-photos?page=0 // get 1000 photos
 * localhost:3000/get-photos?maxcount=10 
 * Headers
 * authorization : Bearer tocken
 */
export async function GetPhotos(request: Request, response: Response) {

    let owner: User;

    if (request.query.ownerid) {
        const ownerid = String(request.query.ownerid);
        if (ownerid.length == 12 || ownerid.length == 24)
            owner = await getManager().getRepository(User).findOne(ownerid)
    } else {
        owner = await getCurrenUserFromToken(request);
    }

    if (!owner) {
        response.status(400).json({ message: "ownerid is incorrect" });
        response.end();
        return;
    }

    const photoRepository = getManager().getRepository(Photo);

    const skip = request.query.page ? Number(request.query.page) : 0
    const take = request.query.maxcount ? Number(request.query.maxcount) : 1000
    const photos = await photoRepository.find({where: { owner: owner.id }, skip, take});

    // return loaded photos
    response.send(photos);
}