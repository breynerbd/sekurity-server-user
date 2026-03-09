import { Report } from "./report.model.js";
import { User } from "../users/user.model.js";
import { Zone } from "../zones/zone.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";
import { Sequelize } from "sequelize";

export const createReport = async (req, res) => {

    try {

        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const report = await Report.create({
            title: req.body.title,
            description: req.body.description,
            incident_type: req.body.incident_type,
            zone_id: req.body.zone_id,
            user_id: internalUser.id
        });

        res.status(201).json(report);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener mis reportes
export const getMyReports = async (req, res) => {

    const internalUser = await getInternalUser({
        auth_id: req.user.id,
        correo: req.user.email
    });

    const reports = await Report.findAll({
        where: { user_id: internalUser.id },
        include: [Zone]
    });

    res.json(reports);
};

//obtener todos los reportes
export const getAllReports = async (req, res) => {
    const reports = await Report.findAll({
        include: [Zone]
    });
    res.json(reports);
};

//obtener estadisticas de los reportes
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

//estadisticas de nivel de severidad
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

//eliminar solo mis reportes
export const deleteMyReport = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
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

//actualizar solo mis reportes
export const updateMyReport = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const report = await Report.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        if (report.user_id !== internalUser.id) {
            return res.status(403).json({ message: "Este reporte no es tuyo" });
        }

        // Campos permitidos
        const allowedFields = ["title", "description", "incident_type", "severity_level", "zone_id"];
        const updateData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        // Validar zone_id
        if (updateData.zone_id) {
            const zoneExists = await Zone.findByPk(updateData.zone_id);
            if (!zoneExists) {
                return res.status(400).json({ message: "La zona proporcionada no existe" });
            }
        }

        // Validar severity_level
        if (updateData.severity_level) {
            const validLevels = ["LOW", "MEDIUM", "HIGH"];
            if (!validLevels.includes(updateData.severity_level)) {
                return res.status(400).json({ message: `El nivel de severidad es inválido. Valores permitidos: ${validLevels.join(", ")}` });
            }
        }

        await report.update(updateData);

        res.json(report);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener reportes por estado
export const getReportsByStatus = async (req, res) => {
    try {
        const reports = await Report.findAll({
            where: { status: req.params.status },
            include: [Zone]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
