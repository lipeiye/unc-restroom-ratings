import { Star } from 'lucide-react'

function StarRating({ rating, maxRating = 5, size = 20, interactive = false, onRate }) {
  return (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= rating
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              size={size}
              className={`${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`}
            />
          </button>
        )
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {typeof rating === 'number' ? rating.toFixed(1) : rating}
        </span>
      )}
    </div>
  )
}

export default StarRating
