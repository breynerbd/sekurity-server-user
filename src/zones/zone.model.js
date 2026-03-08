import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Zone = db.define("zones", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING
    }

}, {
    timestamps: true
});