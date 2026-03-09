import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Comment = db.define("comments", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 1000]
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