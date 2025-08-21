// application/review.ts
import Review from "../infrastructure/db/entities/Review";
import Product from "../infrastructure/db/entities/Product";
import { RequestHandler } from "express";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

export const createReview: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { review, rating, productId, userName, userImage } = req.body;

    if (!review || rating === undefined || !productId || !userName) {
      throw new ValidationError("Missing required fields: review, rating, productId, userName");
    }

    const normalizedRating = Number(rating);
    if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      throw new ValidationError("Rating must be between 1 and 5");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const existingReview = await Review.findOne({
      userId,
      _id: { $in: product.reviews },
    });

    if (existingReview) {
      existingReview.review = String(review).trim();
      existingReview.rating = normalizedRating;
      existingReview.userName = userName;
      existingReview.userImage = userImage || null;
      await existingReview.save();

      res.status(200).json({
        message: "Review updated successfully",
        reviewId: existingReview._id,
      });
      return;
    }

    const newReview = await Review.create({
      review: String(review).trim(),
      rating: normalizedRating,
      userId,
      userName,
      userImage: userImage || null,
    });

    product.reviews.push(newReview._id);
    await product.save();

    res.status(201).json({
      message: "Review created successfully",
      reviewId: newReview._id,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.json(product.reviews);
  } catch (error) {
    next(error);
  }
};

export const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { reviewId } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (review.userId !== userId) {
      res.status(403).json({ error: "Not authorized to delete this review" });
      return;
    }

    await Product.updateMany({ reviews: reviewId }, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateReview: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { reviewId } = req.params;
    const { review, rating } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      throw new NotFoundError("Review not found");
    }

    if (existingReview.userId !== userId) {
      res.status(403).json({ error: "Not authorized to update this review" });
      return;
    }

    if (rating !== undefined) {
      const normalizedRating = Number(rating);
      if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
        throw new ValidationError("Rating must be between 1 and 5");
      }
      existingReview.rating = normalizedRating;
    }

    if (typeof review === "string" && review.trim()) {
      existingReview.review = review.trim();
    }

    await existingReview.save();

    res.status(200).json({
      message: "Review updated successfully",
      review: existingReview,
    });
  } catch (error) {
    next(error);
  }
};