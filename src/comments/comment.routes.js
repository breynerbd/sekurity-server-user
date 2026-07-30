import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
import {
    createComment,
    getMyComments,
    updateMyComment,
    deleteMyComment,
    getAllComments,
    getCommentsByReport,
    reactToComment
} from "../comments/comment.controller.js";

const router = Router();

router.post("/", authenticateUser, createComment);

router.get("/myComments", authenticateUser, getMyComments);

router.get("/", authenticateUser, getAllComments);

router.put("/:id", authenticateUser, updateMyComment);

router.delete("/:id", authenticateUser, deleteMyComment);

router.get("/byReport/:reportId", authenticateUser, getCommentsByReport);

router.post("/:commentId/react", authenticateUser, reactToComment);
export default router;