import { PrismaClient } from "@prisma/client";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';
import env from "../../env.js";
const prisma = new PrismaClient();

export async function updateName(req,res){
    const {newName} = req.body;
    const userId = req.user.id;

    try {
        const updatedInfo = await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                name : newName
            }
        })
        let token = jwt.sign({id : userId,name : newName,email : updatedInfo.email},env.JWT_SECRET);

        return res.json({
            user : {
                name : newName,
                id : userId,
                email : updatedInfo.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

export async function updatePassword(req,res){
    const {newPassword} = req.body;
    const userId = req.user.id;
    // console.log("1. newpassword ",newPassword)
    try {        
        let salt = await bcrypt.genSalt(11);
        let hashpassword = await bcrypt.hash(newPassword,salt);
        const updatedInfo = await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                password : hashpassword
            }
        })
        return res.json({
            user : {
                name : updatedInfo.name,
                id : userId,
                email : updatedInfo.email
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export async function updateEmail(req,res){
    const {newEmail} = req.body;
    try {
        const email = req.user.email;
        const userId = req.user.id;
        const updatedInfo = await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                email : newEmail
            }
        })
        let token = jwt.sign({id : userId,name : newName,email : updatedInfo.email},env.JWT_SECRET);
        return res.json({
            user : {
                name : updatedInfo.name,
                id : updatedInfo.id,
                email : updatedInfo.email
            },
            token
        })
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}