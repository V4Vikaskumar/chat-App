import {Router} from 'express';
import getfriends, { getMessages } from '../controllers/getfriends.controller.js';
import { lastonline } from '../../socket/handlers/chat.handler.js';
const router = Router();

router.get('/friends', getfriends);
router.get('/message',getMessages);
router.post('/lastonline',lastonline);


export default router;