import jwt from 'jsonwebtoken'
import env from '../../env.js';
import { PrismaClient } from '@prisma/client';

let Prisma = new PrismaClient();

export default async function requireAuth(req,res,next){
    try {
        if(!req.headers.authorization) { return res.status(401).json({ error : 'Token Required -1' })}
        let token = req.headers.authorization.split(' ')[1];
        if(!token){ return res.status(401).json({ error : 'Token Required' })};

        // console.log(req.headers)                                                                                                         
        // console.log("Authorization Header:", req.headers.authorization);
        console.log("Extracted Token:", token);
        // console.log("env secret " , env.JWT_SECRET);
        const decoded = jwt.verify(token,env.JWT_SECRET);
        const user = await Prisma.user.findUnique({
            where : {id : decoded.id},
            select : {name : true,email: true,id : true}
        })

        if(!user) { return res.status(401).json({ error : 'Invailed or Expire Token' })};

        req.user = user;
        next();

    } catch (error) {
        console.log("error" ,error);
        return res.status(401).json({ error : 'Unauthorized' })
    }
}