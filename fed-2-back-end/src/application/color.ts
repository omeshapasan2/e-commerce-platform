import Color from "../infrastructure/db/entities/Color";
import { Request, Response, NextFunction } from "express";

const getAllColors = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    next(error);
  }
};

export { getAllColors };