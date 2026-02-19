import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default function(socket, io){
    socket.on("chat:send",async (payload, cb) => {
        try {
            const {receiverId, text} = payload;
            if(!receiverId || !text.trim()) return;
            console.log("payload : ",payload);
            const userId = socket.user.id;
                console.log(userId,receiverId);
            const conv = await getOrCreateConversation(userId,receiverId);

            let message = await prisma.message.create({
                data : {
                    conversationId : conv.id,
                    text,
                    senderId : userId
                },
                include : {
                    sender :{
                        select : {
                            id : true,
                            name : true,
                            email : true
                        }
                    }
                }
            })

            io.to(`user:${userId}`).emit("chat:new", message);
            io.to(`user:${receiverId}`).emit("chat:new", message);
            // console.log("hello", message); 

            cb?.({
                ok : true,
                message
            })
        } catch (error) {
            console.log(error);
            cb?.({
                ok : false,
                error
            })
        }
    })
}

async function getOrCreateConversation(userAId,userBId){
    try {
        const [a,b] = [userAId,userBId].sort();

        let conver = await prisma.directConversation.findUnique({
            where : {
                userAId_userBId :{
                    userAId : a,
                    userBId : b
                }
            }
        });

        if(!conver){
            conver = await prisma.directConversation.create({
                data : {
                    userAId : a,
                    userBId : b
                }
            });
        }

        return conver;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function lastonline(req,res){
    try {
        const userId = req.user.id;
        console.log(userId);

        await prisma.user.update({
            where: { id: userId },
                data: {
                lastOnline: new Date()
            }
        });
    } catch (error) {
        throw new Error(error);
    }
    
}