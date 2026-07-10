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
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    report_id: {
        type: DataTypes.INTEGER,
        allowNull: true   // antes era obligatorio
    },
    zone_id: {
        type: DataTypes.INTEGER,
        allowNull: true   // nuevo
    }
}, {
    timestamps: true,
    validate: {
        // Evita crear un rating "huérfano" o uno que apunte a ambos a la vez
        exactlyOneTarget() {
            if (!this.report_id && !this.zone_id) {
                throw new Error("Debes indicar report_id o zone_id");
            }
            if (this.report_id && this.zone_id) {
                throw new Error("Un rating no puede calificar un reporte y una zona a la vez");
            }
        }
    }
});