import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

function RatingStars({ rating }) {
  const rounded = Math.round(rating); // 0–5
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rounded ? (
          <AiFillStar key={i} className="text-yellow-400" />
        ) : (
          <AiOutlineStar key={i} className="text-gray-300" />
        )
      )}
      <span className="ml-1 text-sm text-gray-600">({rounded})</span>
    </div>
  );
}

export default RatingStars;
