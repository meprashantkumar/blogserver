import express from "express";
import { login, myProfile, registerUser } from "../controllers/user.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router()

router.route('/register').post(registerUser)
router.route("/login").post(login)
router.route("/me").get(isAuth, myProfile)

export default router