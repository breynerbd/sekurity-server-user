import { Comment } from "./comment.model.js";
import { User } from "../users/user.model.js";
import { Report } from "../reports/report.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";
import { CommentReaction } from "./commentReaction.model.js";

export const createComment = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user?.id || req.user?.sub,
            correo: req.user?.email
        });

        if (!internalUser || !internalUser.id) {
            return res.status(404).json({ message: "Usuario interno no encontrado o no registrado" });
        }

        const report = await Report.findByPk(req.body.report_id);
        if (!report) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        if (req.body.parent_id) {
            const parentComment = await Comment.findByPk(req.body.parent_id);
            if (!parentComment) {
                return res.status(404).json({ message: "Comentario padre no encontrado" });
            }
        }

        const comment = await Comment.create({
            content: req.body.content,
            report_id: req.body.report_id,
            user_id: internalUser.id,
            parent_id: req.body.parent_id || null
        });

        const fullComment = await Comment.findByPk(comment.id, {
            include: [
                {
                    model: CommentReaction,
                    attributes: ['id', 'type', 'user_id']
                }
            ]
        });

        res.json(fullComment);

    } catch (error) {
        console.error("ERROR DETALLADO AL CREAR COMENTARIO:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getMyComments = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const comments = await Comment.findAll({
            where: { user_id: internalUser.id },
            include: [
                {
                    model: Report,
                    attributes: ['id', 'title']
                },
                {
                    model: CommentReaction,
                    where: { user_id: internalUser.id },
                    required: false
                }
            ]
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            include: [Report]
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMyComment = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const comment = await Comment.findByPk(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }

        if (comment.user_id !== internalUser.id) {
            return res.status(403).json({ message: "Este comentario no es tuyo" });
        }
        await comment.destroy();

        res.json({ message: "Comentario eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMyComment = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const comment = await Comment.findByPk(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }

        if (comment.user_id !== internalUser.id) {
            return res.status(403).json({ message: "Este comentario no es tuyo" });
        }
        await comment.update(req.body);

        res.json(comment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommentsByReport = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: {
                report_id: req.params.reportId,
                parent_id: null
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'surname']
                },
                {
                    model: CommentReaction,
                    attributes: ['id', 'type', 'user_id']
                },
                {
                    model: Comment,
                    as: 'replies',
                    foreignKey: 'parent_id',
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'surname']
                        },
                        {
                            model: CommentReaction,
                            attributes: ['id', 'type', 'user_id']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (error) {
        console.error("ERROR AL OBTENER COMENTARIOS:", error);
        res.status(500).json({ message: error.message });
    }
};

export const reactToComment = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            email: req.user.email
        });

        const { commentId } = req.params;
        const { type } = req.body;

        if (!["LIKE", "DISLIKE"].includes(type)) {
            return res.status(400).json({ message: "Tipo de reacción inválida" });
        }

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }

        let reaction = await CommentReaction.findOne({
            where: {
                user_id: internalUser.id,
                comment_id: commentId
            }
        });

        if (reaction) {
            if (reaction.type === type) {
                await reaction.destroy();
                return res.json({ message: "Reacción eliminada", action: "removed" });
            } else {
                reaction.type = type;
                await reaction.save();
                return res.json({ message: "Reacción actualizada", action: "updated", reaction });
            }
        } else {
            reaction = await CommentReaction.create({
                user_id: internalUser.id,
                comment_id: commentId,
                type
            });
            return res.json({ message: "Reacción registrada", action: "created", reaction });
        }

    } catch (error) {
        console.error("ERROR AL REACCIONAR:", error);
        res.status(500).json({ message: error.message });
    }
};
