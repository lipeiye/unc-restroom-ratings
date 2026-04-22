import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, AlertTriangle, Clock, Droplets, Sparkles } from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'

function HomePage() {
  const { restrooms, loading, countdown } = useRestrooms()
  const [search, setSearch] = useState('')
  const [filterBuilding, setFilterBuilding] = useState('')

  const buildings = [...new Set(restrooms.map(r => r.building))].sort()

  const filtered = restrooms.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.building.toLowerCase().includes(search.toLowerCase())) return false
    if (filterBuilding && r.building !== filterBuilding) return false
    return true
  })

  const redAlerts = filtered.filter(r => r.redAlert)
  const normal = filtered.filter(r => !r.redAlert)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">UNC Restrooms</h1>
            <p className="text-sm text-gray-400">Real-time ratings · Resets daily at 8PM</p>
          </div>
          <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-bold">
            <Clock size={14} />
            <span>{countdown}</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <select
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white text-sm"
          >
            <option value="">All Buildings</option>
            {buildings.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Red Alert Section */}
      {redAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="text-red-500" size={18} />
            <h2 className="font-bold text-red-600">🚨 RED ALERT ({redAlerts.length})</h2>
          </div>
          <div className="space-y-2">
            {redAlerts.map(r => <RestroomRow key={r._id} restroom={r} />)}
          </div>
        </div>
      )}

      {/* Normal Section */}
      <div>
        <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          All Restrooms ({normal.length})
        </h2>
        <div className="space-y-2">
          {normal.map(r => <RestroomRow key={r._id} restroom={r} />)}
        </div>
      </div>
    </div>
  )
}

function RestroomRow({ restroom }) {
  const scoreColor = (score) => {
    if (score >= 4) return 'text-green-600'
    if (score >= 3) return 'text-yellow-600'
    if (score >= 2) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <Link
      to={`/restroom/${restroom._id}`}
      className={`block rounded-xl p-4 border transition-all hover:shadow-md ${
        restroom.redAlert
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {restroom.redAlert && <span className="text-sm">🚨</span>}
            <h3 className={`font-bold text-sm truncate ${restroom.redAlert ? 'text-red-700' : 'text-gray-900'}`}>
              {restroom.name}
            </h3>
          </div>
          <p className="text-xs text-gray-400">{restroom.building} · {restroom.floor}</p>

          {/* Mini scores */}
          <div className="flex items-center space-x-3 mt-2">
            <div className="flex items-center space-x-1">
              <Droplets size={12} className={scoreColor(restroom.pooperScore)} />
              <span className={`text-xs font-bold ${scoreColor(restroom.pooperScore)}`}>
                {restroom.pooperScore > 0 ? restroom.pooperScore.toFixed(1) : '—'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles size={12} className={scoreColor(restroom.cleanliness)} />
              <span className={`text-xs font-bold ${scoreColor(restroom.cleanliness)}`}>
                {restroom.cleanliness > 0 ? restroom.cleanliness.toFixed(1) : '—'}
              </span>
            </div>
            {restroom.noFlushCount > 0 && (
              <span className="text-xs text-red-500 font-bold">🚫 {restroom.noFlushCount}</span>
            )}
          </div>
        </div>

        <div className="text-right ml-4">
          <div className={`text-2xl font-black ${restroom.redAlert ? 'text-red-600' : 'text-gray-900'}`}>
            {restroom.averageRating > 0 ? restroom.averageRating.toFixed(1) : '—'}
          </div>
          <div className="text-[10px] text-gray-400">{restroom.totalReviews} ratings</div>
        </div>
      </div>
    </Link>
  )
}

export default HomePage
