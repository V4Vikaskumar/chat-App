import { Router} from "express";
import { findname } from "../controllers/auth.friend.js";

const friendsrouter = Router();

friendsrouter.post('/findfriend',findname);

export default friendsrouter;