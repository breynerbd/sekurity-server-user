import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
import {
    createComment,
    getMyComments,
    updateMyComment,
    deleteMyComment,
    getAllComments,
    getCommentsByReport
} from "../comments/comment.controller.js";

const router = Router();

router.post("/", authenticateUser, createComment);

router.get("/myComments", authenticateUser, getMyComments);

router.get("/", authenticateUser, getAllComments);

router.put("/:id", authenticateUser, updateMyComment);

router.delete("/:id", authenticateUser, deleteMyComment);

router.get("/byReport/:reportId", authenticateUser, getCommentsByReport);

export default router;