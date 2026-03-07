const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const STAR = "\u2605";

const RatingStars = ({ rating = 0, count = 0 }) => {
  const normalized = clamp(Number(rating) || 0, 0, 5);

  return (
    <div className="rating-row" aria-label={`Rated ${normalized} out of 5`}>
      <div className="rating-stars">
        {Array.from({ length: 5 }).map((_, index) => {
          const fill = clamp(normalized - index, 0, 1) * 100;
          return (
            <span className="star" key={`star-${index}`}>
              <span className="star-base">{STAR}</span>
              <span className="star-fill" style={{ width: `${fill}%` }}>
                {STAR}
              </span>
            </span>
          );
        })}
      </div>
      <span className="rating-copy">
        {normalized.toFixed(1)} {count ? `(${count})` : ""}
      </span>
    </div>
  );
};

export default RatingStars;
