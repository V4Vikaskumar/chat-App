import { PrismaClient } from "@prisma/client";
import { json } from "express";
import { email } from "zod";

let prisma = new PrismaClient();

export default async function getfriends(req,res,next){
    try {
        let allfriends = await prisma.directConversation.findMany({
            where : {
                OR :[ 
                    {userAId : req.user.id},
                    {userBId : req.user.id}
                ]
            },
            include : {
                userA : { select : { id : true, name : true , email : true, lastSeen : true}},
                userB : { select : { id : true, name : true , email : true, lastSeen : true}},
            }
        })
        // console.log("all Friend ",allfriends)
        res.send(allfriends)
    } catch (error) {
        return error;
    }
    try {
        const unread = await prisma.message.count({
            where: {
                conversationId: conv.id,
                receiverId: userId,
                read: false
            }
        });
        return res.send(unread);
    } catch (error) {
        return error;
    }
}

export async function getMessages(req,res,next){
    try {
        const {conversationId} = req.query;
        let Allmessage = await prisma.message.findMany({
            where : {
                conversationId
            },
            include : {
                sender : {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: "asc" }
        })
        
        return res.status(200).json(Allmessage);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    
}