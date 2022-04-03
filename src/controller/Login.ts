import {Request, Response} from "express";
import {getManager} from "typeorm";
import {User} from "../entity/User";
import { isValidEmail, getNewToken } from "../_help/auth";

import { compareSync } from "bcryptjs";


/**
 * localhost:3000/login
 * Body
 * {
	"email": "user@gmail.com",
	"login": "user",
	"password":  "password"
    }
 */
export async function Login(request: Request, response: Response) {

    const userRepository = getManager().getRepository(User);

    let user: User = null;

    if (request.body.login)
        // load a user by a given post login
        user = await userRepository.findOne({login: request.body.login});
    
    if(user && request.body.email) {
        // TODO email verificate
        if (!isValidEmail(request.body.email)) {
            response.status(400).json({ message: "Email is incorrect" });
            response.end();
            return;
        }

        user = await userRepository.findOne({email: request.body.email});
    }

    // if post was not found return 404 to the client
    if (!user) {
        response.status(400).json({ message: "Username or password is incorrect" });
        response.end();
        return;
    }

    if (!compareSync(request.body.password, user.password)) {
        response.status(400).json({ message: "Username or password is incorrect" });
        response.end();
        return;
    }
   
    const token = getNewToken(user);
    

    // return tocken
    response.send(token);
}
