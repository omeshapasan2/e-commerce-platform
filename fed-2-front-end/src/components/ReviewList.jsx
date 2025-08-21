import { Card, CardContent } from "./ui/card";

function ReviewList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return <p className="mt-8">No reviews yet.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      {reviews.map((rev) => (
        <Card key={rev._id}>
          <CardContent className="space-y-1">
            <div className="font-semibold">Rating: {rev.rating}</div>
            <p>{rev.review}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ReviewList;