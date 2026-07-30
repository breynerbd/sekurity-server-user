import { Zone } from "./zone.model.js";
import { Report } from "../reports/report.model.js";
import { Rating } from "../ratings/rating.model.js";

export const getZones = async (req, res) => {
    try {
        const zones = await Zone.findAll({
            include: [
                {
                    model: Report,
                    as: "reports",
                    attributes: ["id", "status"],
                    where: { status: "ACTIVE" },
                    required: false
                },
                { model: Rating, as: "ratings", attributes: ["score"] }
            ]
        });

        const formattedZones = zones.map(zone => {
            const zoneJson = zone.toJSON();
            const reportsCount = zoneJson.reports ? zoneJson.reports.length : 0;

            const ratings = zoneJson.ratings || [];
            const averageRating = ratings.length > 0
                ? ratings.reduce((acc, r) => acc + (r.score || 0), 0) / ratings.length
                : 0;

            return {
                ...zoneJson,
                reportsCount,
                averageRating,
                reports: undefined,
                ratings: undefined
            };
        });

        res.json(formattedZones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getZoneById = async (req, res) => {
    try {
        const zone = await Zone.findByPk(req.params.id, {
            include: [
                {
                    model: Report,
                    as: "reports",
                    where: { status: "ACTIVE" },
                    required: false
                },
                { model: Rating, as: "ratings" }
            ]
        });

        if (!zone) {
            return res.status(404).json({ message: "Zona no encontrada" });
        }

        const zoneJson = zone.toJSON();
        const reportsCount = zoneJson.reports ? zoneJson.reports.length : 0;
        const ratings = zoneJson.ratings || [];
        const averageRating = ratings.length > 0
            ? ratings.reduce((acc, r) => acc + (r.score || 0), 0) / ratings.length
            : 0;

        res.json({
            ...zoneJson,
            reportsCount,
            averageRating
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createZone = async (req, res) => {
    try {
        const { name, description, latitude, longitude } = req.body;

        if (!name) {
            return res.status(400).json({ message: "El nombre de la zona es obligatorio" });
        }

        const newZone = await Zone.create({
            name,
            description,
            latitude,
            longitude
        });

        res.status(201).json({
            ...newZone.toJSON(),
            reportsCount: 0,
            averageRating: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};