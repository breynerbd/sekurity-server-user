import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Comment = db.define("comments", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "comments",
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    timestamps: true,
});