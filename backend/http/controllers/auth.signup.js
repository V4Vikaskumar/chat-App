// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Signin, Signup } from "../services/Auth.service.js";
import { signinSchema, signupSchema } from "../schema/Auth.schema.js";

const prisma = new PrismaClient();

export async function postSignup(req,res,next){
    try {
        const check = signupSchema.safeParse(req.body);
        if(!check.success){
            return res.status(401).json({
                error : JSON.parse(check.error)
            })
        }
        const {email,name,password} = req.body;
        // console.log('emai', email ); 
        let data = await Signup({email,name,password});
        return res.status(201).json({
            data
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message : 'Signup function got fail',
            error
        })
    }
}

export async function postSignin(req,res,next){
    try {
        let check = await signinSchema.safeParse(req.body);
        if(!check.success){
            return res.status(400).json({
                error : JSON.parse(check.error)
            })
        }
        const {email,password} = req.body;
        // console.log('emai', email ); 
        let data = await Signin({email,password});
        return res.status(201).json({
            data
        })
    } catch (error) {
        return error;
    }
}

export async function getme(req,res,next) {
    try {
        return res.status(201).json({
            user : req.user
        })
    } catch (error) {
        return res.status(401).json({
            error
        })
    }
}