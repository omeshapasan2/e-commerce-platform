import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { clerkMiddleware } from "@clerk/express";

import productRouter from "./api/product";
import categoryRouter from "./api/category";
import reviewRouter from "./api/review";
import { orderRouter } from "./api/order";
import { paymentsRouter } from "./api/payment";
import { handleWebhook } from "./application/payment";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { connectDB } from "./infrastructure/db/index";

const app = express();

/** 1) Safe endpoints first (no auth, no DB needed) */
app.get("/health", (_req: Request, res: Response): void => {
  res.send("Server is Online");
});

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

/** 2) Core middleware */
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

/** 3) Clerk for everything after this point */
app.use(clerkMiddleware());

/** 4) Routers */
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentsRouter);

/** 5) Error handler last */
app.use(globalErrorHandlingMiddleware);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));