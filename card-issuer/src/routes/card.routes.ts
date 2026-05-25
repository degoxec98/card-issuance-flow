import { Router, Request, Response, NextFunction } from "express";
import { controller } from "../controllers";

const router = Router();

router.post("/issue", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.issue(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
