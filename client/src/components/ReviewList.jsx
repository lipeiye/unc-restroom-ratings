import { formatDistanceToNow } from '../utils/dateFormat'
import StarRating from './StarRating'
import { User, Clock } from 'lucide-react'

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No reviews yet. Be the first to write one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <div
          key={review._id || index}
          className="review-card bg-white rounded-lg shadow-sm p-5 border border-gray-100"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-unc-blue/10 rounded-full flex items-center justify-center">
                <User size={20} className="text-unc-blue" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{review.authorName || 'Anonymous'}</p>
                <div className="flex items-center text-xs text-gray-400 mt-0.5">
                  <Clock size={12} className="mr-1" />
                  {review.createdAt ? formatDistanceToNow(review.createdAt) : 'Recently'}
                </div>
              </div>
            </div>
            <StarRating rating={review.rating} size={16} />
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.content}</p>

          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {review.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewList
