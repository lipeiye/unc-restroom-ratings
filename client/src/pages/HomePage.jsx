import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  AlertTriangle,
  Clock,
  Droplets,
  Sparkles,
  Plus,
  X,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'
import { buildBuildingPath, groupRestroomsByBuilding } from '../utils/buildings'

function HomePage() {
  const { restrooms, loading, countdown, createRestroom } = useRestrooms()
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRestroom, setNewRestroom] = useState({ name: '', building: '', floor: '', description: '' })

  const buildings = groupRestroomsByBuilding(restrooms)
  const normalizedSearch = search.trim().toLowerCase()

  const filteredBuildings = buildings.filter(building => {
    if (!normalizedSearch) {
      return true
    }

    return (
      building.name.toLowerCase().includes(normalizedSearch) ||
      building.floors.some(floor => floor.toLowerCase().includes(normalizedSearch)) ||
      building.restrooms.some(restroom =>
        restroom.name.toLowerCase().includes(normalizedSearch) ||
        (restroom.description || '').toLowerCase().includes(normalizedSearch)
      )
    )
  })

  const redAlerts = filteredBuildings.filter(building => building.hasRedAlert)
  const normalBuildings = filteredBuildings.filter(building => !building.hasRedAlert)

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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600 mb-2">Building Directory</p>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Browse restroom info building by building</h1>
            <p className="text-sm text-gray-500 mt-2">
              Each card is a UNC building. Open one to see the floors, scores, and flagged restrooms inside.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-bold w-fit">
            <Clock size={14} />
            <span>{countdown}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          <div className="rounded-2xl bg-white border border-gray-100 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Buildings</div>
            <div className="text-3xl font-black text-gray-900">{filteredBuildings.length}</div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Restrooms</div>
            <div className="text-3xl font-black text-gray-900">
              {filteredBuildings.reduce((sum, building) => sum + building.restroomCount, 0)}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Red Alerts</div>
            <div className="text-3xl font-black text-red-600">
              {filteredBuildings.reduce((sum, building) => sum + building.redAlertCount, 0)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search a building, floor, or restroom name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showAddForm ? 'Cancel' : 'Add a Restroom'}</span>
        </button>
      </div>

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

      {redAlerts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="text-red-500" size={18} />
            <h2 className="font-bold text-red-600">Buildings With Red Alerts ({redAlerts.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {redAlerts.map(building => <BuildingCard key={building.name} building={building} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          All Buildings ({normalBuildings.length})
        </h2>
        {normalBuildings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {normalBuildings.map(building => <BuildingCard key={building.name} building={building} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
            <Building2 className="mx-auto text-gray-300 mb-3" size={28} />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No buildings match this search</h3>
            <p className="text-sm text-gray-500">Try another building name, floor label, or restroom keyword.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function BuildingCard({ building }) {
  const scoreColor = (score) => {
    if (score >= 4) return 'text-green-600'
    if (score >= 3) return 'text-yellow-600'
    if (score >= 2) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <Link
      to={buildBuildingPath(building.name)}
      className={`group block rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        building.hasRedAlert
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            {building.hasRedAlert && <span className="text-base">🚨</span>}
            <span className={`text-xs font-bold uppercase tracking-[0.24em] ${building.hasRedAlert ? 'text-red-500' : 'text-sky-600'}`}>
              {building.floorCount} floors
            </span>
          </div>
          <h3 className={`text-2xl font-black tracking-tight ${building.hasRedAlert ? 'text-red-700' : 'text-gray-900'}`}>
            {building.name}
          </h3>
          <p className={`text-sm font-medium mt-1 ${building.hasRedAlert ? 'text-red-500' : 'text-gray-500'}`}>
            {building.restroomCount} restroom entries · {building.totalReviews} total ratings
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {building.floors.map(floor => (
              <span
                key={`${building.name}-${floor}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  building.hasRedAlert ? 'bg-white text-red-600 border border-red-100' : 'bg-sky-50 text-sky-700'
                }`}
              >
                {floor}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
            <div className="flex items-center space-x-1">
              <Droplets size={12} className={scoreColor(building.pooperScore)} />
              <span className={`text-xs font-bold ${scoreColor(building.pooperScore)}`}>
                {building.pooperScore > 0 ? building.pooperScore.toFixed(1) : '—'}
              </span>
              <span className="text-[10px] text-gray-300 font-medium">Poopability</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles size={12} className={scoreColor(building.cleanliness)} />
              <span className={`text-xs font-bold ${scoreColor(building.cleanliness)}`}>
                {building.cleanliness > 0 ? building.cleanliness.toFixed(1) : '—'}
              </span>
              <span className="text-[10px] text-gray-300 font-medium">Clean</span>
            </div>
            {building.noFlushCount > 0 && (
              <span className="text-xs text-red-500 font-bold">🚫 {building.noFlushCount} no-flush reports</span>
            )}
          </div>
        </div>

        <div className="text-right ml-4 flex flex-col items-end justify-between self-stretch">
          <ChevronRight className={`transition-transform group-hover:translate-x-1 ${building.hasRedAlert ? 'text-red-400' : 'text-gray-300'}`} size={20} />
          <div>
            <div className={`text-4xl font-black leading-none ${building.hasRedAlert ? 'text-red-600' : 'text-gray-900'}`}>
              {building.averageRating > 0 ? building.averageRating.toFixed(1) : '—'}
            </div>
            <div className="text-[10px] text-gray-400 font-medium mt-1">building score</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HomePage
