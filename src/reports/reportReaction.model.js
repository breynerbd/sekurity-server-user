import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const ReportReaction = db.define("report_reactions", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    report_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 3
        }
    }
}, {
    timestamps: true
});