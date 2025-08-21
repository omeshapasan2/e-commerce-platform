import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

function ReviewForm({ onSubmit, isLoading }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !review) return;
    onSubmit({ review, rating: Number(rating) });
    setReview("");
    setRating("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Textarea
        placeholder="Write your review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <Select value={rating} onValueChange={setRating}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isLoading}>
        Submit
      </Button>
    </form>
  );
}

export default ReviewForm;