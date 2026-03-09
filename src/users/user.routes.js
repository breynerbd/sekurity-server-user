import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
import { getMyProfile, updateMyProfile } from "../users/user.controller.js";

const router = Router();

router.get("/me", authenticateUser, getMyProfile);
router.put("/me", authenticateUser, updateMyProfile);

export default router;