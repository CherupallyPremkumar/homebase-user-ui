import { useState, useEffect } from "react";
import { Star, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { ReviewDto } from "@/types/dto";

interface ProductReviewsProps {
  productId: number;
  productName: string;
  reviews?: ReviewDto[];
}

export const ProductReviews = ({ productId, productName, reviews: initialReviews = [] }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<ReviewDto[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    author: "",
    comment: "",
  });

  // Update reviews when prop changes
  useEffect(() => {
    if (initialReviews.length > 0) {
      setReviews(initialReviews);
    }
  }, [initialReviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.author.trim() || !newReview.comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const review: ReviewDto = {
      id: Date.now().toString(),
      author: newReview.author,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, author: "", comment: "" });
    setShowReviewForm(false);

    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      )
    );
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-display font-bold">Customer Reviews</h3>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-bold font-mono">{averageRating.toFixed(1)}</div>
            <div className="pb-2">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(averageRating)
                      ? "fill-primary text-primary"
                      : "text-border"
                      }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-3 w-3 fill-primary text-primary" />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {!showReviewForm && (
        <Button onClick={() => setShowReviewForm(true)} className="gap-2">
          <Star className="h-4 w-4" />
          Write a Review
        </Button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card className="p-6 space-y-4 border-primary/20">
          <h4 className="font-display font-semibold text-lg">Write Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label htmlFor="rating" className="mb-2 block">
                Your Rating
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${rating <= newReview.rating
                        ? "fill-primary text-primary"
                        : "text-border"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="author">Your Name</Label>
              <Input
                id="author"
                value={newReview.author}
                onChange={(e) =>
                  setNewReview({ ...newReview, author: e.target.value })
                }
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Share your experience with this product..."
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit">Submit Review</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.avatar} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating
                          ? "fill-primary text-primary"
                          : "text-border"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-foreground leading-relaxed">{review.comment}</p>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpful(review.id)}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
