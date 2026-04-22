import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Clock, MapPin, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'
import StarRating from '../components/StarRating'

function RestroomDetail() {
  const { id } = useParams()
  const { restrooms, countdown, submitRating } = useRestrooms()
  const restroom = restrooms.find(r => r._id === id)

  if (!restroom) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Restroom not found</p>
        <Link to="/" className="text-red-500 hover:underline">← Back</Link>
      </div>
    )
  }

  const amenityList = [
    { key: 'handicapAccessible', label: 'Accessible', icon: '♿' },
    { key: 'changingTable', label: 'Changing Table', icon: '👶' },
    { key: 'freePadsTampons', label: 'Free Supplies', icon: '🩸' },
    { key: 'airDryer', label: 'Air Dryer', icon: '💨' },
    { key: 'paperTowels', label: 'Paper Towels', icon: '🧻' }
  ]

  const handleRate = async (rating) => {
    try {
      await submitRating(restroom._id, rating)
      alert(`Rated ${rating} stars!`)
    } catch (err) {
      alert('Failed to submit rating')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors mb-6">
        <ArrowLeft size={18} />
        <span>Back to list</span>
      </Link>

      {/* Header Card */}
      <div className={`rounded-xl p-6 border mb-6 ${restroom.redAlert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {restroom.redAlert && <AlertTriangle className="text-red-500" size={24} />}
              <h1 className={`text-2xl font-bold ${restroom.redAlert ? 'text-red-700' : 'text-gray-900'}`}>
                {restroom.name}
              </h1>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin size={14} className="mr-1" />
              {restroom.building} · Floor {restroom.floor}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${restroom.redAlert ? 'text-red-600' : 'text-gray-900'}`}>
              {restroom.averageRating > 0 ? restroom.averageRating.toFixed(1) : '—'}
            </div>
            <StarRating rating={restroom.averageRating} size={18} />
            <p className="text-sm text-gray-400 mt-1">{restroom.totalReviews} ratings</p>
          </div>
        </div>

        {restroom.redAlert && (
          <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
            <AlertTriangle size={16} />
            <span>This restroom has received multiple low ratings and is flagged as RED ALERT!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Amenities & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {amenityList.map(({ key, label, icon }) => (
                <div key={key} className={`flex items-center space-x-2 p-3 rounded-lg ${restroom.amenities?.[key] ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                  <span>{icon}</span>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">About</h2>
            <p className="text-gray-600 text-sm">{restroom.description}</p>
          </div>
        </div>

        {/* Right: Rate Now */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Rate This Restroom</h2>
            <p className="text-sm text-gray-500 mb-4">Tap a star to submit your rating. Data resets daily at 8 PM.</p>

            <div className="flex items-center justify-center space-x-4 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="w-14 h-14 rounded-full bg-gray-100 hover:bg-yellow-100 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                >
                  <span className="text-2xl">⭐</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center space-x-1"><ThumbsDown size={12} /><span>Bad</span></span>
              <span className="flex items-center space-x-1"><span>Great</span><ThumbsUp size={12} /></span>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-100 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock size={16} className="text-red-500" />
              <h3 className="font-bold text-red-700">Daily Reset</h3>
            </div>
            <p className="text-sm text-red-600">
              All ratings reset every day at 8:00 PM. Next reset in: <span className="font-mono font-bold">{countdown}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestroomDetail
