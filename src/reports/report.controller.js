import { Report } from "./report.model.js";
import { User } from "../users/user.model.js";
import { Zone } from "../zones/zone.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";
import { Sequelize } from "sequelize";
import { ReportReaction } from "./reportReaction.model.js";
import { Comment } from "../comments/comment.model.js";


export const createReport = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            email: req.user.email
        });

        const report = await Report.create({
            title: req.body.title,
            description: req.body.description,
            incident_type: req.body.incident_type,
            severity_level: req.body.severity_level,
            zone_id: req.body.zone_id,
            user_id: internalUser.id
        });

        const fullReport = await Report.findByPk(report.id, {
            include: [Zone, { model: User, attributes: ['id', 'name', 'surname', 'email'] }]
        });

        res.status(201).json(fullReport);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                Zone,
                {
                    model: User,
                    attributes: ['id', 'name', 'surname', 'email']
                },
                {
                    model: ReportReaction,
                    as: "report_reactions"
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'surname', 'email']
                        }
                    ]
                }
            ]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyReports = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            email: req.user.email
        });

        const reports = await Report.findAll({
            where: { user_id: internalUser.id },
            include: [
                Zone,
                {
                    model: User,
                    attributes: ['id', 'name', 'surname', 'email']
                },
                {
                    model: ReportReaction,
                    as: "report_reactions",
                    where: { user_id: internalUser.id },
                    required: false
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'surname', 'email']
                        }
                    ]
                }
            ]
        });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReportStats = async (req, res) => {
    try {
        const stats = await Report.findAll({
            attributes: [
                'zone_id',
                [Sequelize.fn('COUNT', Sequelize.col('reports.id')), 'total_reports']
            ],
            include: [{
                model: Zone,
                attributes: ['id', 'name', 'description']
            }],
            group: ['reports.zone_id', 'zone.id']
        });

        res.json(stats);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSeverityStats = async (req, res) => {
    try {
        const stats = await Report.findAll({
            attributes: [
                'severity_level',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_reports']
            ],
            group: ['severity_level']
        });

        res.json(stats);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMyReport = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            email: req.user.email
        });

        const report = await Report.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        if (report.user_id !== internalUser.id) {
            return res.status(403).json({ message: "Este reporte no es tuyo" });
        }
        await report.destroy();

        res.json({ message: "Reporte eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMyReport = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            email: req.user.email
        });

        const report = await Report.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        if (report.user_id !== internalUser.id) {
            return res.status(403).json({ message: "Este reporte no es tuyo" });
        }

        const allowedFields = ["title", "description", "incident_type", "severity_level", "zone_id"];
        const updateData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        if (updateData.zone_id) {
            const zoneExists = await Zone.findByPk(updateData.zone_id);
            if (!zoneExists) {
                return res.status(400).json({ message: "La zona proporcionada no existe" });
            }
        }

        if (updateData.severity_level) {
            const validLevels = ["LOW", "MEDIUM", "HIGH"];
            if (!validLevels.includes(updateData.severity_level)) {
                return res.status(400).json({ message: `El nivel de severidad es inválido. Valores permitidos: ${validLevels.join(", ")}` });
            }
        }

        await report.update(updateData);

        const updatedReport = await Report.findByPk(report.id, {
            include: [Zone, { model: User, attributes: ['id', 'name', 'surname', 'email'] }]
        });

        res.json(updatedReport);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReportsByStatus = async (req, res) => {
    try {
        const reports = await Report.findAll({
            where: { status: req.params.status },
            include: [
                Zone,
                {
                    model: User,
                    attributes: ['id', 'name', 'surname', 'email']
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'surname', 'email']
                        }
                    ]
                }
            ]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReportById = async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id, {
            include: [
                Zone,
                {
                    model: User,
                    attributes: ['id', 'name', 'surname', 'email']
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'surname', 'email']
                        }
                    ]
                }
            ]
        });
        if (!report) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const rawType = req.body.severity_rating ?? req.body.danger_level ?? req.body.severity ?? req.body.type;

        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            email: req.user.email
        });

        if (!internalUser || !internalUser.id) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        if (rawType === null || rawType === undefined || rawType === "") {
            await ReportReaction.destroy({
                where: { user_id: internalUser.id, report_id: id }
            });
        } else {
            const reactionType = Number(rawType);

            if (![1, 2, 3].includes(reactionType)) {
                return res.status(400).json({ message: "Nivel de severidad inválido. Debe ser 1, 2 o 3." });
            }

            await ReportReaction.upsert({
                user_id: internalUser.id,
                report_id: Number(id),
                type: reactionType
            });
        }

        const fullReport = await Report.findByPk(id, {
            include: [
                Zone,
                { model: User, attributes: ['id', 'name', 'surname', 'email'] },
                { model: ReportReaction, as: "report_reactions" }
            ]
        });

        return res.json(fullReport);
    } catch (error) {
        console.error("Error en rateReport:", error);
        return res.status(500).json({ message: error.message || "Error interno del servidor" });
    }
};