import { Router } from "express";
import { getZones, getZoneById, createZone } from "../zones/zone.controller.js";

const router = Router();

router.get("/", getZones);
router.get("/:id", getZoneById);
router.post("/", createZone);

export default router;