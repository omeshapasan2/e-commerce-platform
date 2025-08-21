import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  userId: {
    type: String,
    required: true, // Clerk user ID
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: null, // Profile picture URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;