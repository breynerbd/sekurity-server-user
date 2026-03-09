import { Comment } from "./comment.model.js";
import { User } from "../users/user.model.js";
import { Report } from "../reports/report.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const createComment = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        // Verificar que el reporte exista
        const report = await Report.findByPk(req.body.report_id);
        if (!report) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        const comment = await Comment.create({
            content: req.body.content,
            report_id: req.body.report_id,
            user_id: internalUser.id
        });

        res.json(comment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener mis comentarios
export const getMyComments = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const comments = await Comment.findAll({
            where: { user_id: internalUser.id },
            include: [Report]
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener todos los comentarios
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

//eliminar solo mis comentarios
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

//actualizar solo mis comentarios
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