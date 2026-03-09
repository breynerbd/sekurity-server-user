import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Rating = db.define("ratings", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    report_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    timestamps: true
});