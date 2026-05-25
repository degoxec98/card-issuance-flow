import express from "express";
import helmet from "helmet";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import router from "./routes/card.routes";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(requestLoggerMiddleware);
app.use("/cards", router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;