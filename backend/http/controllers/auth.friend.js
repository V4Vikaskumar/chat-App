import { findfriend } from "../schema/Auth.schema.js";
import { checkemail } from "../services/friend.service.js";


export async function findname(req,res,next) {
    try {
        const check = findfriend.safeParse(req.body);
        if(!check.success){
            return res.status(401).json({
                error : JSON.parse(check.error)
            })
        }
        const {email} = req.body;
        let data = await checkemail({email});
        console.log("line 15 --> ",data)
        return res.status(201).json({
            data
        })
    } catch (error) {
        console.log(error);
        return error;
    }
}