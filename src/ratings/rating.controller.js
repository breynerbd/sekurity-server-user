import { Rating } from "./rating.model.js";
import { Report } from "../reports/report.model.js";
import { Zone } from "../zones/zone.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const rateReport = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const rating = await Rating.create({
            score: req.body.score,
            report_id: req.body.report_id,
            user_id: internalUser.id
        });

        res.status(201).json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener mis calificaciones
export const getMyRatings = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const ratings = await Rating.findAll({
            where: { user_id: internalUser.id },
            include: [Report]
        });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rateZone = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const zone = await Zone.findByPk(req.params.zoneId);
        if (!zone) {
            return res.status(404).json({ message: "Zona no encontrada" });
        }

        const rating = await Rating.create({
            score: req.body.score,
            comment: req.body.comment,
            zone_id: req.params.zoneId,
            user_id: internalUser.id
        });

        res.status(201).json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRatingsByZone = async (req, res) => {
    try {
        const ratings = await Rating.findAll({
            where: { zone_id: req.params.zoneId }
        });
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};