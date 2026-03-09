import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { corsOptions } from "./cors-configuration.js";
import { helmetConfiguration } from "./helmet-configuration.js";
import { requestLimit } from "../middlewares/request-limit.js";
import { errorHandler } from "../middlewares/handle-errors.js";

import userRouter from "../src/users/user.routes.js";
import reportRouter from "../src/reports/report.routes.js";
import zoneRouter from "../src/zones/zone.routes.js";
import commentRouter from "../src/comments/comment.routes.js";
import ratingRouter from "../src/ratings/rating.routes.js";

dotenv.config();

export const initServerUser = () => {
    const app = express();
    const BASE_URL = "/sekurity/v1/user";

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(express.urlencoded({ extended: false }));
    app.use(morgan("dev"));
    app.use(requestLimit);

    app.use(`${BASE_URL}/users`, userRouter);
    app.use(`${BASE_URL}/reports`, reportRouter);
    app.use(`${BASE_URL}/zones`, zoneRouter);
    app.use(`${BASE_URL}/comments`, commentRouter);
    app.use(`${BASE_URL}/ratings`, ratingRouter);

    app.get("/health", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Sekurity User API running correctly"
        });
    });

    app.use(errorHandler);

    return app;
};