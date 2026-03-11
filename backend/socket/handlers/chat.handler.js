import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default function (socket, io) {
  socket.on("chat:send", async (payload, cb) => {
    try {
      const { receiverId, text, type = "text" } = payload;

      if (!receiverId) {
        return cb?.({ ok: false, error: "Receiver required" });
      }

      // text message me empty text allow nahi
      if (type === "text" && (!text || !text.trim())) {
        return cb?.({ ok: false, error: "Message cannot be empty" });
      }

      const userId = socket.user.id;
      
      const conv = await getOrCreateConversation(userId, receiverId);

      const message = await prisma.message.create({
        data: {
          conversationId: conv.id,
          text,
          type, 
          senderId: userId,
          receiverId
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

        // console.log('Message ==> ', message);
      // sender ko bhejo
      io.to(`user:${userId}`).emit("chat:new", message);

      // receiver ko bhejo
      io.to(`user:${receiverId}`).emit("chat:new", message);

      // delivered mark karo agar receiver online hai
      const sockets = await io.in(`user:${receiverId}`).fetchSockets();

      if (sockets.length > 0) {
        await prisma.message.update({
          where: { id: message.id },
          data: { delivered: true }
        });

        io.to(`user:${userId}`).emit("message:delivered", {
          messageId: message.id
        });
      }

      cb?.({
        ok: true,
        message,
      });
    } catch (error) {
      console.log(error);
      cb?.({
        ok: false,
        error: "Message send failed",
      });
    }
  });

  socket.on("disconnect", async () => {
    try {
      await prisma.user.update({
          where : {id : socket.user.id},
          data : {
              online : false,
              lastSeen : new Date()
          }
      })
      
      io.emit('user:offline',{
          userId : socket.user.id,
          lastSeen : new Date()
      });
    } catch (error) {
      console.log(error);
      // throw new Error(error);
    }
          
  });
  socket.on("connect", async () => {
    try {
      await prisma.user.update({
          where: { id: socket.user.id },
          data: { online: true }
      });

      io.emit("user:online", socket.user.id);
    } catch (error) {
      console.log(error);
      // throw new Error(error);
    }    
  });

  socket.on("message:read", async ({ conversationId, senderId }) => {
    try {
      const userId = socket.user.id;

      const messages = await prisma.message.updateMany({
        where: {
          conversationId,
          senderId,
          receiverId: userId,
          read: false
        },
        data: { read: true }
      });

      io.to(`user:${senderId}`).emit("message:read:update", {
        conversationId
      });
       
      } catch (error) {
        console.log(error);
        // throw new Error(error);
      }
    });

    socket.on("chat:new", (data) => {
      if (
        data.conversationId &&
        messages.length > 0 &&
        data.conversationId === messages[0].conversationId
      ) {
        setMessages(prev => [...prev, data]);
      }
    });
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
        // throw new Error(error);
    }
}

export async function lastonline(req,res){
    try {
        const userId = req.user.id;
        // console.log(userId);

        await prisma.user.update({
            where: { id: userId },
              data: {
                lastSeen: new Date()
              }
        });
    } catch (error) {
      console.log(error);
        // throw new Error(error);
    }
}