import { Rating } from "./rating.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";
import { Report } from "../reports/report.model.js";

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
