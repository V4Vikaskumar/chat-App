import bcrypt from 'bcrypt';
import env from "../../env.js";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
let prisma = new PrismaClient();

export async function Signup({email,name,password}){
    try {
        let existing = await prisma.user.findUnique({
            where : {email}
        });
        if(existing){
            let err = new Error('User Already Exist');
            err.status = 401;
            throw err;
        }
        let salt = await bcrypt.genSalt(11);
        let passwordhash = await bcrypt.hash(password,salt);

        let user = await prisma.user.create({
            data : {
                name,
                password : passwordhash,
                email
            }
        })

        let token = await jwt.sign({id:user.id ,name,email}, env.JWT_SECRET);
        // console.log("Token ==> ",token);
        return {
            user : {
                id : user.id,
                name : user.name || '',
                email : user.email
            },
            token
        }
    } catch (error) {
        console.log(error);
        // throw error;
    }
}

export async function Signin({email,password}){
    try {
        let user = await prisma.user.findUnique({
            where : {email}
        });
        if(!user){
            let err = new Error('Invailed login Credentials');
            err.status = 401;
            throw err;
        }
        let ok = await bcrypt.compare(password,user.password);
        if(!ok){
            let err = new Error('Invailed login email');
            err.status = 401;
            throw err;
        }
        let token = await jwt.sign({name : user.name,email,id:user.id}, env.JWT_SECRET);


        return {
            user : {
                id : user.id,
                name : user.name || '',
                email : user.email
            },
            token
        }
    } catch (error) {
        console.log(error);
        // throw error;
    }
}