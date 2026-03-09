import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Report = db.define("reports", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT
    },

    incident_type: {
        type: DataTypes.STRING
    },

    severity_level: {
        type: DataTypes.STRING,
        validate: {
            isIn: [["LOW", "MEDIUM", "HIGH"]]
        },
        defaultValue: "MEDIUM"
    },

    status: {
        type: DataTypes.STRING,
        validate: {
            isIn: [["ACTIVE", "IN_PROGRESS", "RESOLVED", "CANCELLED"]]
        },
        defaultValue: "ACTIVE"
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    zone_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    timestamps: true
});