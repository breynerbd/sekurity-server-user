import { Router } from "express";
import { getZones, getZoneById } from "../zones/zone.controller.js";

const router = Router();

router.get("/", getZones);
router.get("/:id", getZoneById);

export default router;