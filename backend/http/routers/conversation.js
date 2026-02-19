import { Router} from "express";
import { createconversation } from "../services/conversation.services.js";

const conversationRoute = Router();

conversationRoute.post('/conversation',createconversation);

export default conversationRoute;