import { User } from "../users/user.model.js";

export const getInternalUser = async ({ auth_id, correo, nombre, apellido, telefono }) => {
    if (!auth_id || !correo)
        throw new Error("auth_id y correo son requeridos");

    let user = await User.findOne({
        where: { auth_id }
    });

    if (!user) {
        user = await User.create({
            auth_id,
            nombre: nombre ?? "PENDIENTE",
            apellido: apellido ?? "PENDIENTE",
            correo,
            telefono: telefono ?? "PENDIENTE",
            role: "USER"
        });
    }

    return user;
};