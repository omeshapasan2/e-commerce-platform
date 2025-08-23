import express, { Router, Request, Response, NextFunction } from "express";
import { createOrder, getOrder } from "./../application/order";
import isAuthenticated from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";
import Order from "../infrastructure/db/entities/Order";
import { getAuth } from "@clerk/express";
import { Types } from "mongoose";

export const orderRouter = express.Router();

orderRouter.get(
  "/daily-sales",
  isAuthenticated,
  isAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const range = (req.query.range === "30d" ? "30d" : "7d") as "7d" | "30d";
      const days = range === "30d" ? 30 : 7;
      const TZ = "Asia/Colombo";

      const now = new Date();
      const slNow = new Date(now.toLocaleString("en-US", { timeZone: TZ }));
      const startOfTodaySL = new Date(
        slNow.getFullYear(), slNow.getMonth(), slNow.getDate(), 0, 0, 0, 0
      );
      const windowStartSL = new Date(startOfTodaySL);
      windowStartSL.setDate(startOfTodaySL.getDate() - (days - 1));

      const docs = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(windowStartSL.getTime() - 24 * 3600 * 1000),
              $lt: new Date(startOfTodaySL.getTime() + 2 * 24 * 3600 * 1000),
            },
          },
        },
        { $unwind: { path: "$items", preserveNullAndEmptyArrays: false } },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "prod",
          },
        },
        { $unwind: { path: "$prod", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            _qty: { $ifNull: ["$items.quantity", 0] },
            _price: { $ifNull: ["$prod.price", 0] },
          },
        },
        { $addFields: { _lineTotal: { $multiply: ["$_qty", "$_price"] } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: TZ,
              },
            },
            total: { $sum: "$_lineTotal" },
          },
        },
        { $project: { _id: 0, date: "$_id", total: 1 } },
      ]);

      const map = new Map(docs.map((d: any) => [d.date, d.total]));
      const data: { date: string; total: number }[] = [];
      for (let i = 0, d = new Date(windowStartSL); i < days; i++) {
        const key = [
          d.getFullYear(),
          String(d.getMonth() + 1).padStart(2, "0"),
          String(d.getDate()).padStart(2, "0"),
        ].join("-");
        data.push({ date: key, total: map.get(key) ?? 0 });
        d.setDate(d.getDate() + 1);
      }

      res.json({ range, timezone: TZ, data });
    } catch (err) {
      console.error("GET /api/orders/daily-sales failed:", err);
      next(err);
    }
  }
);

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
        .populate("items.productId", "name price image")
        .populate("addressId", "line_1 line_2 city phone")
        .lean();

      const withTotals = orders.map((o: any) => {
        const amount = (o.items || []).reduce((sum: number, it: any) => {
          const p = it?.productId || {};
          const unit = typeof p.price === "number" ? p.price : 0;
          const qty = typeof it.quantity === "number" ? it.quantity : 0;
          return sum + unit * qty;
        }, 0);
        const { addressId, ...rest } = o;
        return { ...rest, address: addressId, amount };
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
        .populate("items.productId", "name price image")
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