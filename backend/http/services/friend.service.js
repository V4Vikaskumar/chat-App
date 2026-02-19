import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkemail({email}){
    try {
        const data = await prisma.user.findUnique({
            where : {email}
        })
        if(!data){
            return false;
        }
        return data;
    } catch (error) {
        return error;
    }
}