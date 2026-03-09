import { getInternalUser } from "../utils/getInternalUser.js";
import { User } from "./user.model.js";
import fetch from "node-fetch";

export const getMyProfile = async (req, res) => {

    const user = await getInternalUser({
        auth_id: req.user.id,
        correo: req.user.email
    });

    res.json(user);
};

//actualizar solo mi perfil
export const updateMyProfile = async (req, res) => {
    try {
        const internalUser = await getInternalUser({
            auth_id: req.user.id,
            correo: req.user.email
        });

        const user = await User.findByPk(internalUser.id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Solo campos editables: nombre, apellido, telefono
        const editableFields = ['nombre', 'apellido', 'telefono'];
        const updates = {};
        editableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        await user.update(updates);

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
