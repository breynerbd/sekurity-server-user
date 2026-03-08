import dotenv from "dotenv";
dotenv.config();

import { dbConnection, db } from "./configs/db.js";
import { initServerUser } from "./configs/app.js";
import { setupAssociations } from "./src/associations.js";

const PORT = process.env.PORT || 3006;

const startServerUser = async () => {
    try {
        await dbConnection();
        setupAssociations();

        await db.sync({ alter: true });
        console.log("✅ Tablas USER sincronizadas");

        const app = initServerUser();
        app.listen(PORT, () => {
            console.log(`🚀 Sekurity USER API running at http://localhost:${PORT}/sekurity/v1`);
        });
    } catch (error) {
        console.error("❌ Error starting USER server:", error);
        process.exit(1);
    }
};

startServerUser();