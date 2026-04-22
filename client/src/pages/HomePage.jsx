import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Map as MapIcon, List, Star } from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'
import MapView from '../components/MapView'
import RestroomCard from '../components/RestroomCard'
import TagFilter from '../components/TagFilter'

function HomePage() {
  const { restrooms, loading, buildings, filterRestrooms } = useRestrooms()
  const [viewMode, setViewMode] = useState('map') // 'map' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredRestrooms = useMemo(() => {
    return filterRestrooms({
      search: searchQuery,
      building: selectedBuilding,
      minRating: minRating > 0 ? minRating : null,
      tags: selectedTags
    })
  }, [filterRestrooms, searchQuery, selectedBuilding, minRating, selectedTags])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unc-blue"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search & Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search restrooms or buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-unc-blue focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-unc-blue transition-colors"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
            {(selectedBuilding || minRating > 0 || selectedTags.length > 0) && (
              <span className="bg-unc-blue text-white text-xs px-2 py-0.5 rounded-full">
                {[selectedBuilding, minRating > 0, selectedTags.length > 0].filter(Boolean).length}
              </span>
            )}
          </button>
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1 px-4 py-2 transition-colors ${viewMode === 'map' ? 'bg-unc-blue text-white' : 'hover:bg-gray-50'}`}
            >
              <MapIcon size={18} />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1 px-4 py-2 transition-colors ${viewMode === 'list' ? 'bg-unc-blue text-white' : 'hover:bg-gray-50'}`}
            >
              <List size={18} />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
                <select
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-unc-blue outline-none"
                >
                  <option value="">All Buildings</option>
                  {buildings.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setMinRating(minRating === star ? 0 : star)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                        minRating >= star ? 'bg-yellow-50 border-yellow-300' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Star size={14} className={minRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      <span className="text-sm">{star}+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <TagFilter selectedTags={selectedTags} onToggleTag={toggleTag} />
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Showing {filteredRestrooms.length} of {restrooms.length} restrooms
        </p>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-md border border-gray-200">
            <MapView restrooms={filteredRestrooms} />
          </div>
          <div className="overflow-y-auto space-y-4 pr-2">
            {filteredRestrooms.map(restroom => (
              <RestroomCard key={restroom._id} restroom={restroom} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestrooms.map(restroom => (
            <RestroomCard key={restroom._id} restroom={restroom} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
