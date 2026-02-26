import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import multer from 'multer';
import cloud from 'cloudinary';
import path from 'path';
import env from "../../env.js";
const cloudinary = cloud.v2;

export async function createconversation(req, res) {
  try {
    const { receiverId ,asp} = req.body;
    // console.log("asp ==> ",asp);
    const userId = asp.id;

    const [userAId, userBId] = [userId, receiverId].sort();

    let existing = await prisma.directConversation.findUnique({
      where: {
        userAId_userBId: {
          userAId,
          userBId
        }
      },
      include: {
        userA: true,
        userB: true
      }
    });
      // console.log("ye hai bhai ",existing);
    if (existing) {
      return res.json(existing);
    }

    const conversation = await prisma.directConversation.create({
      data: {
        userAId,
        userBId
      },
      include: {
        userA: true,
        userB: true
      }
    });

    return res.json(conversation);
  } catch (error) {
    return error;
  }
  
};


cloudinary.config({
  cloud_name: env.Cloud_name,
  api_key: env.Api_key,
  api_secret: env.Api_secret
});


// const multer = require('multer');


export async function filesend(req,res){
    console.log(req.file);
    cloudinary.uploader
        .upload(req.file.path)
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'File uploaded successfully',
                fileUrl : result.secure_url,
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Unable to upload File',
                err
            })
        })
}