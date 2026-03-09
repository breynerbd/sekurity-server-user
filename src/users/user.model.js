import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const User = db.define("users", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    auth_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellido: {
        type: DataTypes.STRING
    },

    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    telefono: {
        type: DataTypes.STRING
    },

    role: {
        type: DataTypes.STRING,
        defaultValue: "USER"
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    timestamps: true
});