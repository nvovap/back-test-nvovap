import * as expressJwt from "express-jwt";
import { getManager } from "typeorm";
import { User } from "../entity/User"
import { getToken } from "./auth"


export function jwt() {    
    return expressJwt({ algorithms: ['HS256'], secret:  "f34dsq33fvs5331fvv-secret", isRevoked, getToken }).unless({
        path: [
            // public routes that don't require authentication
            '/login',
            '/register'
        ]
    });
}



async function isRevoked(req, payload, done) {

    const userRepository = getManager().getRepository(User);

    // load a user by a given user id in JWT payload
    const user = await userRepository.findOne(payload.userid);

    // revoke token if user no longer exists
    if (!user) return done(null, true);

    done();
}