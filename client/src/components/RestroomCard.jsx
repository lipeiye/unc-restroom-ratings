import { Link } from 'react-router-dom'
import { MapPin, MessageSquare, ThumbsUp } from 'lucide-react'
import StarRating from './StarRating'

function RestroomCard({ restroom }) {
  const amenityLabels = {
    handicapAccessible: 'Accessible',
    changingTable: 'Changing Table',
    freePadsTampons: 'Free Supplies',
    airDryer: 'Air Dryer',
    paperTowels: 'Paper Towels'
  }

  const activeAmenities = Object.entries(restroom.amenities || {})
    .filter(([_, value]) => value)
    .map(([key, _]) => amenityLabels[key])

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{restroom.name}</h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              {restroom.building} · Floor {restroom.floor}
            </div>
          </div>
          <div className="flex items-center bg-unc-blue/10 px-3 py-1 rounded-full">
            <StarRating rating={restroom.averageRating || 0} size={16} />
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restroom.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {restroom.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {activeAmenities.map(amenity => (
            <span key={amenity} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full flex items-center">
              <ThumbsUp size={10} className="mr-1" />
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <MessageSquare size={14} className="mr-1" />
            {restroom.totalReviews || 0} reviews
          </div>
          <Link
            to={`/restroom/${restroom._id || restroom.id}`}
            className="text-unc-blue hover:text-unc-navy font-medium text-sm transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RestroomCard
