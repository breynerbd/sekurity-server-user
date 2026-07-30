import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const CommentReaction = db.define("comment_reactions", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("LIKE", "DISLIKE"),
        allowNull: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'comment_id']
        }
    ]
});