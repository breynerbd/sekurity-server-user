import { Router } from "express";
import { getZones } from "../zones/zone.controller.js";

const router = Router();

router.get("/", getZones);

export default router;