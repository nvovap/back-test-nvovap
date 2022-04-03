import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/User";
import { isValidEmail, getUserPasswordHash, getNewToken } from "../_help/auth"


export async function Register(request: Request, response: Response) {

     //  email verificate
    if (request.body.email) {
        if (!isValidEmail(request.body.email)) {
            response.status(400).json({ message: "Email is incorrect" });
            response.end();
            return;
        }
    }

    const user = new User()
    user.email = request.body.email
    user.login = request.body.login
    user.password = getUserPasswordHash(request.body.password)
    user.registerDate = new Date();

    const manager = getManager();
    await manager.save(user)
 
    const token = getNewToken(user);
    
    response.send(token);
}