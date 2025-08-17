import express, { Request, Response, NextFunction } from "express";
import { createOrder, getOrder } from "./../application/order";
import isAuthenticated from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";
import Order from "../infrastructure/db/entities/Order";
import { getAuth } from "@clerk/express";

export const orderRouter = express.Router();

// Customer Orders (for Customers)
orderRouter.get(
  "/me",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = getAuth(req);
      if (!userId) { res.status(401).json({ message: "Unauthorized" }); return; }

      const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .populate("items.productId", "name price image") // adjust field names if needed
        .lean(); // return plain JS objects

      const withTotals = orders.map((o: any) => {
        const amount = (o.items || []).reduce((sum: number, it: any) => {
          const p = it?.productId || {};
          const unit = typeof p.price === "number" ? p.price : 0;
          const qty = typeof it.quantity === "number" ? it.quantity : 0;
          return sum + unit * qty;
        }, 0);
        return { ...o, amount };
      });

      res.json(withTotals);
    } catch (err) {
      console.error("GET /api/orders/me failed:", err);
      next(err);
    }
  }
);

// All Orders (For admin)
orderRouter.get(
  "/",
  isAuthenticated,
  isAdmin,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("items.productId", "name price image") // adjust if your product fields differ
        .lean();

      const withTotals = orders.map((o: any) => {
        const amount = (o.items || []).reduce((sum: number, it: any) => {
          const p = it?.productId || {};
          const unit = typeof p.price === "number" ? p.price : 0;
          const qty = typeof it.quantity === "number" ? it.quantity : 0;
          return sum + unit * qty;
        }, 0);
        return { ...o, amount };
      });

      res.json(withTotals);
    } catch (err) {
      console.error("GET /api/orders failed:", err);
      next(err);
    }
  }
);

orderRouter.route("/").post(isAuthenticated, createOrder);
orderRouter.route("/:id").get(getOrder);