import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, Check, X, ThumbsUp } from 'lucide-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { useRestroomDetail } from '../hooks/useRestrooms'
import StarRating from '../components/StarRating'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'

const createIcon = () => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background-color: #7BAFD4;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  ">🚻</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

function RestroomDetail() {
  const { id } = useParams()
  const { restroom, reviews, loading, submitReview } = useRestroomDetail(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unc-blue"></div>
      </div>
    )
  }

  if (!restroom) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Restroom not found</p>
        <Link to="/" className="text-unc-blue hover:underline">← Back to home</Link>
      </div>
    )
  }

  const amenityList = [
    { key: 'handicapAccessible', label: 'Handicap Accessible', icon: '♿' },
    { key: 'changingTable', label: 'Baby Changing Table', icon: '👶' },
    { key: 'freePadsTampons', label: 'Free Pads/Tampons', icon: '🩸' },
    { key: 'airDryer', label: 'Air Dryer', icon: '💨' },
    { key: 'paperTowels', label: 'Paper Towels', icon: '🧻' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-500 hover:text-unc-blue transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        <span>Back to all restrooms</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{restroom.name}</h1>
                <div className="flex items-center text-gray-500 mt-2">
                  <MapPin size={16} className="mr-1" />
                  {restroom.building} · Floor {restroom.floor}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-unc-blue">
                  {restroom.averageRating > 0 ? restroom.averageRating.toFixed(1) : '—'}
                </div>
                <StarRating rating={restroom.averageRating || 0} size={14} />
                <p className="text-sm text-gray-400 mt-1">{restroom.totalReviews || 0} reviews</p>
              </div>
            </div>
            <p className="text-gray-600">{restroom.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {amenityList.map(({ key, label, icon }) => {
                const hasIt = restroom.amenities?.[key]
                return (
                  <div
                    key={key}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      hasIt ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className={`text-sm ${hasIt ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                      {label}
                    </span>
                    {hasIt ? (
                      <Check size={16} className="text-green-500 ml-auto" />
                    ) : (
                      <X size={16} className="text-gray-300 ml-auto" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Common Tags</h2>
            <div className="flex flex-wrap gap-2">
              {restroom.tags?.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-unc-blue/10 text-unc-blue rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              )) || (
                <span className="text-gray-400 text-sm">No tags yet</span>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Location</h2>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapContainer
                center={[restroom.location.lat, restroom.location.lng]}
                zoom={18}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[restroom.location.lat, restroom.location.lng]}
                  icon={createIcon()}
                />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Reviews */}
        <div className="space-y-6">
          <ReviewForm onSubmit={submitReview} />
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Reviews ({reviews.length})
            </h2>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestroomDetail
