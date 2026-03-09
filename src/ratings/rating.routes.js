import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
import {
    rateReport,
    getMyRatings
} from "../ratings/rating.controller.js";

const router = Router();

router.get("/myRatings", authenticateUser, getMyRatings);

router.post("/", authenticateUser, rateReport);

export default router;