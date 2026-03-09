import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({ message: "Token requerido" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔹 Obtener auth_id y correo desde JWT (C#)
        const authId = decoded.sub
            || decoded.nameid
            || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        const email = decoded.email
            || decoded.Email
            || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

        if (!authId || !email)
            return res.status(401).json({ message: "Token inválido o incompleto" });

        req.user = {
            id: authId,
            email,
            role: decoded.role
                || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Token inválido" });
    }
};