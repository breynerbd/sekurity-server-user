import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
import { rateZone, getRatingsByZone } from "../ratings/rating.controller.js";
import {
    rateReport,
    getMyRatings
} from "../ratings/rating.controller.js";

const router = Router();

router.get("/myRatings", authenticateUser, getMyRatings);

router.post("/", authenticateUser, rateReport);
router.get("/byZone/:zoneId", authenticateUser, getRatingsByZone);
router.post("/zone/:zoneId", authenticateUser, rateZone);

export default router;