import { Router } from "express";
import { getme, postSignin, postSignup } from "../controllers/auth.signup.js";
import requireAuth from "../middlewares/Auth.requireAuth.js";
import { updateEmail, updateName, updatePassword } from "../services/Auth.update.js";

const router = Router();

router.post('/signup',postSignup);
router.post('/signin',postSignin);
router.get('/me', requireAuth,getme);
router.post('/updatename',requireAuth,updateName);
router.post('/updatepassword',requireAuth,updatePassword);
router.post('/updateemail', requireAuth, updateEmail);

export default router;