import { Router} from "express";
import { createconversation, filesend } from "../services/conversation.services.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension)
    }
})


const upload = multer({ storage: storage });
const conversationRoute = Router();

conversationRoute.post('/conversation',createconversation);
conversationRoute.post('/upload', upload.single('file'), filesend);

export default conversationRoute;