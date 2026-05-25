import { Request, Response, NextFunction } from "express";
import { logger } from "../commons/utils/Logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err, "Unhandled error");

  res.status(500).json({
    statusCode: 500,
    message: err.message || "Internal server error",
    timestamp: new Date().toISOString(),
  });
};
