import { Router } from "express";
import { getme, postSignin, postSignup } from "../controllers/auth.signup.js";
import requireAuth from "../middlewares/Auth.requireAuth.js";

const router = Router();

router.post('/signup',postSignup);
router.post('/signin',postSignin);
router.get('/me', requireAuth ,getme);

export default router;