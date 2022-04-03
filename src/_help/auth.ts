import { hashSync } from "bcryptjs"
import * as jwt  from "jsonwebtoken";
import { Request } from "express";
import { User } from "../entity/User";
import { getManager } from "typeorm";



function getEmailValidatePattern() : RegExp {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
}

export function isValidEmail(email) : boolean  {
    if (typeof email !== 'string') return false;
    return getEmailValidatePattern().test(email);
}

export function getUserPasswordHash(password) : string {
    return hashSync(password, 10)
}

export function getNewToken(user: User) : string {
    return jwt.sign({ userid: user.id }, "f34dsq33fvs5331fvv-secret", {expiresIn: 86400}); // expiresIn one day
}

export async function getCurrenUserFromToken(request: Request) {

    const token = getToken(request);
    const payload = jwt.verify(token,  "f34dsq33fvs5331fvv-secret");

    const userRepository = getManager().getRepository(User);

    // load a user by a given user id in JWT payload
    const user = await userRepository.findOne(payload["userid"]);

    return user;
}

export function getToken (request: Request): string | any {
    if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
        return request.headers.authorization.split(' ')[1];
    } else if (request.query && request.query.token) { // this for websocket
        return request.query.token;
    } 
    
    return null;
}