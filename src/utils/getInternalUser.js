import { User } from "../users/user.model.js";

export const getInternalUser = async ({ auth_id, email }) => {

    if (!auth_id || !email) {
        throw new Error("auth_id y email son requeridos");
    }


    const user = await User.findOne({
        where: {
            auth_id
        }
    });


    if (!user) {
        throw new Error("Usuario interno no encontrado");
    }


    return user;
};