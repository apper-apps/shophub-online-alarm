import ApperIcon from "@/components/ApperIcon";

const StarRating = ({ rating = 0, maxRating = 5, size = 16, showNumber = true, className = "" }) => {
  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <ApperIcon
        key={i}
        name="Star"
        size={size}
        className={i <= rating ? "text-accent-400 fill-current" : "text-secondary-300"}
      />
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars}
      </div>
      {showNumber && (
        <span className="text-sm text-secondary-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;