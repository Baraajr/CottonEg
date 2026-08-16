import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

function RatingStars({ rating = 0, onChange, interactive = false }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const Star = i <= rounded ? AiFillStar : AiOutlineStar;

        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange(i) : undefined}
            disabled={!interactive}
            className={
              interactive ? 'cursor-pointer transition hover:scale-110' : ''
            }
          >
            <Star
              className={i <= rounded ? 'text-yellow-400' : 'text-gray-300'}
            />
          </button>
        );
      })}

      {!interactive && (
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      )}
    </div>
  );
}

export default RatingStars;
