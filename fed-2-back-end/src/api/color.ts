import express from "express";
import { getAllColors } from "../application/color";

const colorRouter = express.Router();

colorRouter.route("/").get(getAllColors);

export default colorRouter;