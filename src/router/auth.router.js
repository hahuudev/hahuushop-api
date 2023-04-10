import express from "express";
import { getAuth, logout, signin, signup } from "~/controllers/auth.controller";
import { verifyToken } from "~/middleware/verifyToken";
import { signinValidator, signupValidator } from "~/validators/auth.validator";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
router.get("/auth", verifyToken, getAuth);
router.get("/auth/logout", verifyToken, logout);

export default router;
