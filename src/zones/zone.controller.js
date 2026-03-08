import { Zone } from "./zone.model.js";

export const getZones = async (req, res) => {

    const zones = await Zone.findAll();

    res.json(zones);
};