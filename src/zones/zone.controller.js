import { Zone } from "./zone.model.js";

export const getZones = async (req, res) => {
    try {
        const zones = await Zone.findAll();
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getZoneById = async (req, res) => {
    try {
        const zone = await Zone.findByPk(req.params.id);
        if (!zone) {
            return res.status(404).json({ message: "Zona no encontrada" });
        }
        res.json(zone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};