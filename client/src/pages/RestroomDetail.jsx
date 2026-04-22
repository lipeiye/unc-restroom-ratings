import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Clock } from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'

function RestroomDetail() {
  const { id } = useParams()
  const { restrooms, countdown, submitRating, submitNoFlush } = useRestrooms()
  const restroom = restrooms.find(r => r._id === id)

  if (!restroom) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Restroom not found</p>
        <Link to="/" className="text-red-500 hover:underline font-medium">← Back</Link>
      </div>
    )
  }

  const handleRate = async (rating) => {
    try {
      await submitRating(restroom._id, rating)
    } catch (err) {
      alert('Failed to submit rating')
    }
  }

  const handleNoFlush = async () => {
    try {
      await submitNoFlush(restroom._id)
      alert('Red Alert triggered!')
    } catch (err) {
      alert('Failed to trigger alert')
    }
  }

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600'
    if (score >= 3) return 'text-yellow-600'
    if (score >= 2) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBar = (score) => {
    if (score >= 4) return 'bg-green-500'
    if (score >= 3) return 'bg-yellow-500'
    if (score >= 2) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors mb-6 text-sm">
        <ArrowLeft size={16} />
        <span>Back to list</span>
      </Link>

      {/* Header */}
      <div className={`rounded-2xl p-6 border mb-6 ${restroom.redAlert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {restroom.redAlert && <AlertTriangle className="text-red-500" size={22} />}
              <h1 className={`text-xl font-bold ${restroom.redAlert ? 'text-red-700' : 'text-gray-900'}`}>
                {restroom.name}
              </h1>
            </div>
            <p className="text-sm text-gray-500">{restroom.building} · Floor {restroom.floor}</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${restroom.redAlert ? 'text-red-600' : 'text-gray-900'}`}>
              {restroom.averageRating > 0 ? restroom.averageRating.toFixed(1) : '—'}
            </div>
            <div className="text-xs text-gray-400">{restroom.totalReviews} ratings</div>
          </div>
        </div>

        {restroom.redAlert && (
          <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center space-x-2">
            <AlertTriangle size={18} />
            <span>
              {restroom.noFlushCount > 0
                ? `NO FLUSH DETECTED! (${restroom.noFlushCount} reports)`
                : 'LOW RATING ALERT! This restroom is flagged.'}
            </span>
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500 mb-1">Poopability</div>
          <div className={`text-3xl font-black ${getScoreColor(restroom.pooperScore)}`}>
            {restroom.pooperScore > 0 ? restroom.pooperScore.toFixed(1) : '—'} <span className="text-lg text-gray-300">/5</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${getScoreBar(restroom.pooperScore)}`} style={{ width: `${(restroom.pooperScore / 5) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500 mb-1">Cleanliness</div>
          <div className={`text-3xl font-black ${getScoreColor(restroom.cleanliness)}`}>
            {restroom.cleanliness > 0 ? restroom.cleanliness.toFixed(1) : '—'} <span className="text-lg text-gray-300">/5</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${getScoreBar(restroom.cleanliness)}`} style={{ width: `${(restroom.cleanliness / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">How was it?</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Tap a star to rate</p>

        <div className="flex items-center justify-center space-x-2 mb-6">
          {/* Bad Face */}
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-1">🤢</span>
            <span className="text-xs text-gray-400 font-medium">Bad</span>
          </div>

          {/* Stars */}
          <div className="flex items-center space-x-1 mx-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-yellow-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-gray-100 hover:border-yellow-200"
              >
                <span className="text-2xl transition-transform">⭐</span>
              </button>
            ))}
          </div>

          {/* Great Face */}
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-1">😍</span>
            <span className="text-xs text-gray-400 font-medium">Great</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 px-4">
          <span>Terrible</span>
          <span>Okay</span>
          <span>Perfect</span>
        </div>
      </div>

      {/* No Flush Alert Button */}
      <button
        onClick={handleNoFlush}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-3 mb-6"
      >
        <span className="text-2xl">🚫🚽</span>
        <span className="text-lg">Someone Didn't Flush! Red Alert</span>
        <AlertTriangle size={20} />
      </button>

      {/* Countdown */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-1">
          <Clock size={14} />
          <span>Daily Reset</span>
        </div>
        <p className="text-xs text-gray-400">
          All ratings reset at 6:00 AM · Next reset in <span className="font-mono font-bold text-gray-600">{countdown}</span>
        </p>
      </div>
    </div>
  )
}

export default RestroomDetail
