import { Star } from "lucide-react";

export const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "fill-amber-500 text-amber-500"
                : "fill-stone-200 text-stone-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <article
      className="bg-white p-6 border border-stone-100 min-w-[320px] max-w-[320px] flex-shrink-0"
      data-testid="review-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-stone-50 font-serif text-lg">
          {review.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-medium text-stone-900 text-sm">{review.name}</h4>
          {renderStars(review.rating)}
        </div>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed line-clamp-4">
        "{review.comment}"
      </p>
    </article>
  );
};

export default ReviewCard;
