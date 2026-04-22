import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, AlertTriangle, Clock, Droplets, Sparkles, Plus, X } from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'

function HomePage() {
  const { restrooms, loading, countdown, createRestroom } = useRestrooms()
  const [search, setSearch] = useState('')
  const [filterBuilding, setFilterBuilding] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRestroom, setNewRestroom] = useState({ name: '', building: '', floor: '', description: '' })

  const buildings = [...new Set(restrooms.map(r => r.building))].sort()

  const filtered = restrooms.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.building.toLowerCase().includes(search.toLowerCase())) return false
    if (filterBuilding && r.building !== filterBuilding) return false
    return true
  })

  const redAlerts = filtered.filter(r => r.redAlert)
  const normal = filtered.filter(r => !r.redAlert)

  const handleAddRestroom = async (e) => {
    e.preventDefault()
    if (!newRestroom.building || !newRestroom.floor) return
    await createRestroom(newRestroom)
    setNewRestroom({ name: '', building: '', floor: '', description: '' })
    setShowAddForm(false)
  }

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
            <p className="text-sm text-gray-400">Real-time ratings · Resets daily at 6AM</p>
          </div>
          <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-bold">
            <Clock size={14} />
            <span>{countdown}</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search building or floor..."
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

        {/* Add Restroom Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showAddForm ? 'Cancel' : 'Add a Restroom'}</span>
        </button>
      </div>

      {/* Add Restroom Form */}
      {showAddForm && (
        <form onSubmit={handleAddRestroom} className="bg-white rounded-xl border border-gray-100 p-5 mb-6 space-y-3">
          <h3 className="font-bold text-gray-900">Add New Restroom</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Building name *"
              value={newRestroom.building}
              onChange={(e) => setNewRestroom(p => ({ ...p, building: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
              required
            />
            <input
              type="text"
              placeholder="Floor (e.g. 1F, B1) *"
              value={newRestroom.floor}
              onChange={(e) => setNewRestroom(p => ({ ...p, floor: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Restroom name (optional)"
            value={newRestroom.name}
            onChange={(e) => setNewRestroom(p => ({ ...p, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newRestroom.description}
            onChange={(e) => setNewRestroom(p => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
          />
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
          >
            Add Restroom
          </button>
        </form>
      )}

      {/* Red Alert Section */}
      {redAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="text-red-500" size={18} />
            <h2 className="font-bold text-red-600">RED ALERT ({redAlerts.length})</h2>
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
          {/* BUILDING NAME — MOST PROMINENT */}
          <div className="flex items-center space-x-2 mb-0.5">
            {restroom.redAlert && <span className="text-base">🚨</span>}
            <h3 className={`text-lg font-black tracking-tight uppercase truncate ${restroom.redAlert ? 'text-red-700' : 'text-gray-900'}`}>
              {restroom.building}
            </h3>
          </div>
          {/* Floor — secondary */}
          <p className={`text-sm font-semibold ${restroom.redAlert ? 'text-red-500' : 'text-gray-500'}`}>
            {restroom.name} · {restroom.floor}
          </p>

          {/* Scores row */}
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Droplets size={12} className={scoreColor(restroom.pooperScore)} />
              <span className={`text-xs font-bold ${scoreColor(restroom.pooperScore)}`}>
                {restroom.pooperScore > 0 ? restroom.pooperScore.toFixed(1) : '—'}
              </span>
              <span className="text-[10px] text-gray-300 font-medium">Poopability</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles size={12} className={scoreColor(restroom.cleanliness)} />
              <span className={`text-xs font-bold ${scoreColor(restroom.cleanliness)}`}>
                {restroom.cleanliness > 0 ? restroom.cleanliness.toFixed(1) : '—'}
              </span>
              <span className="text-[10px] text-gray-300 font-medium">Clean</span>
            </div>
            {restroom.noFlushCount > 0 && (
              <span className="text-xs text-red-500 font-bold">🚫 {restroom.noFlushCount}</span>
            )}
          </div>
        </div>

        {/* Rating — right side, large */}
        <div className="text-right ml-4 flex flex-col items-end justify-center">
          <div className={`text-3xl font-black leading-none ${restroom.redAlert ? 'text-red-600' : 'text-gray-900'}`}>
            {restroom.averageRating > 0 ? restroom.averageRating.toFixed(1) : '—'}
          </div>
          <div className="text-[10px] text-gray-400 font-medium mt-1">{restroom.totalReviews} ratings</div>
        </div>
      </div>
    </Link>
  )
}

export default HomePage
