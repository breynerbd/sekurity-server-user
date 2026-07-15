import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Rating = db.define("ratings_v2", {
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
        exactlyOneTarget() {
            // Aseguramos obtener el valor real ya sea de dataValues o del contexto directo
            const reportId = this.report_id || (this.dataValues && this.dataValues.report_id);
            const zoneId = this.zone_id || (this.dataValues && this.dataValues.zone_id);

            if (!reportId && !zoneId) {
                throw new Error("Debes indicar report_id o zone_id");
            }
            if (reportId && zoneId) {
                throw new Error("Un rating no puede calificar un reporte y una zona a la vez");
            }
        }
    }
});