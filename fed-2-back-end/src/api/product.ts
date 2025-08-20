import express, { RequestHandler } from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  uploadProductImage,
  getProductsForSearchQuery,
} from "../application/product";
import isAuthenticated from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const productRouter = express.Router();

const validateImageFileType: RequestHandler = (req, res, next) => {
  const { fileType } = req.body || {};
  const ok =
    typeof fileType === "string" &&
    /^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(fileType);
  if (!ok) {
    res.status(400).json({ message: "Invalid or missing image file type" });
    return;
  }
  next();
};

productRouter
  .route("/")
  .get(getAllProducts)
  .post(isAuthenticated, isAdmin, createProduct);

productRouter.get("/search", getProductsForSearchQuery);

productRouter
  .route("/images")
  .post(isAuthenticated, isAdmin, validateImageFileType, uploadProductImage);

productRouter
  .route("/:id")
  .get(getProductById)
  .put(isAuthenticated, isAdmin, updateProductById)
  .delete(isAuthenticated, isAdmin, deleteProductById);

export default productRouter;
