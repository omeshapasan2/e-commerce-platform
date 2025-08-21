import express from "express";
import { 
  createReview, 
  getReviewsByProduct, 
  deleteReview, 
  updateReview 
} from "../application/review";

const reviewRouter = express.Router();

// Create a new review
reviewRouter.route("/").post(createReview);

// Get all reviews for a specific product
reviewRouter.route("/product/:productId").get(getReviewsByProduct);

// Update a review (user can only update their own review)
reviewRouter.route("/:reviewId").put(updateReview);

// Delete a review (user can only delete their own review)
reviewRouter.route("/:reviewId").delete(deleteReview);

export default reviewRouter;