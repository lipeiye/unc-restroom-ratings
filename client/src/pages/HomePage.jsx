import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, AlertTriangle, Clock, Star, Building2 } from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'
import StarRating from '../components/StarRating'

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">UNC Restroom Ratings</h1>
          <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Clock size={16} />
            <span>Resets in: {countdown}</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search building or restroom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
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
            <AlertTriangle className="text-red-500" size={20} />
            <h2 className="text-lg font-bold text-red-600">🚨 RED ALERT ({redAlerts.length})</h2>
          </div>
          <div className="space-y-3">
            {redAlerts.map(r => <RestroomRow key={r._id} restroom={r} />)}
          </div>
        </div>
      )}

      {/* Normal Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center space-x-2">
          <Building2 size={18} />
          <span>All Restrooms ({normal.length})</span>
        </h2>
        <div className="space-y-3">
          {normal.map(r => <RestroomRow key={r._id} restroom={r} />)}
        </div>
      </div>
    </div>
  )
}

function RestroomRow({ restroom }) {
  return (
    <Link
      to={`/restroom/${restroom._id}`}
      className={`block rounded-xl p-4 border transition-all hover:shadow-md ${
        restroom.redAlert
          ? 'bg-red-50 border-red-200 hover:border-red-300'
          : 'bg-white border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {restroom.redAlert && (
              <AlertTriangle size={16} className="text-red-500" />
            )}
            <h3 className={`font-bold ${restroom.redAlert ? 'text-red-700' : 'text-gray-900'}`}>
              {restroom.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500">{restroom.building} · Floor {restroom.floor}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${restroom.redAlert ? 'text-red-600' : 'text-gray-900'}`}>
            {restroom.averageRating > 0 ? restroom.averageRating.toFixed(1) : '—'}
          </div>
          <StarRating rating={restroom.averageRating} size={14} />
          <p className="text-xs text-gray-400 mt-1">{restroom.totalReviews} ratings</p>
        </div>
      </div>
    </Link>
  )
}

export default HomePage
