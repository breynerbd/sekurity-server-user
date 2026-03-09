import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
import {
    createReport,
    getMyReports,
    getAllReports,
    getReportStats,
    getSeverityStats,
    getReportsByStatus,
    deleteMyReport,
    updateMyReport
} from "../reports/report.controller.js";

const router = Router();

router.post("/", authenticateUser, createReport);

router.get("/myReports", authenticateUser, getMyReports);

router.get("/", authenticateUser, getAllReports);

router.get("/stats", authenticateUser, getReportStats);

router.get("/severityStats", authenticateUser, getSeverityStats);

router.get("/reportsByStatus/:status", authenticateUser, getReportsByStatus);

router.delete("/:id", authenticateUser, deleteMyReport);

router.put("/:id", authenticateUser, updateMyReport);

export default router;