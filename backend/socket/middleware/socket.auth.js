import { PrismaClient } from "@prisma/client";
import env from "../../env.js";
import jwt from 'jsonwebtoken';

let prisma = new PrismaClient();

const {JWT_SECRET} = env;
export async function socketAuth(socket, next){
    try {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];
        // console.log(token);

        if(!token){
            const tl = JSON.parse(localStorage.getItem('token'));
            if(!tl){
                throw new Error('Token not Found');
            }
            token = tl;
        }
        const payload = jwt.verify(token,JWT_SECRET);
        console.log("payload",payload);
        const userId = payload.id;
        if(!userId){
            throw new Error('User hi nahi hai bhai ...');
        }

        const user = await prisma.user.findUnique({
            where : {id : userId},
            select : {
                name : true,
                id : true,
                email : true
            },
        });
        if(!user){
            console.log(userId);
            throw new Error('user not Found');
        }

        socket.user = user;
        next();
    } catch (error) {
        console.log(error)
        console.error(error);
        next(new Error('Unauthorized'));
    }
}