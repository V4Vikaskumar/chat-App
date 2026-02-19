import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createconversation(req, res) {
  try {
    const { receiverId ,asp} = req.body;
    console.log("asp ==> ",asp);
    const userId = asp.id;

    // check already exists
    const existing = await prisma.directConversation.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: receiverId },
          { userAId: receiverId, userBId: userId }
        ]
      },
      include : {
        userA : true,
        userB : true
      }
    });

    if (existing) {
      return res.json(existing);
    }

    const conversation = await prisma.directConversation.create({
      data: {
        userAId: userId,
        userBId: receiverId
      },
      include: {
        userA: true,
        userB: true
      }
    });

    res.json(conversation);
  } catch (error) {
    return error;
  }
  
};
