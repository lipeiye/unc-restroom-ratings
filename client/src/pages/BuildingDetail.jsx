import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Building2, Clock, Droplets, Sparkles, ChevronRight } from 'lucide-react'
import { useRestrooms } from '../hooks/useRestrooms'
import { groupRestroomsByBuilding } from '../utils/buildings'

function BuildingDetail() {
  const { buildingName } = useParams()
  const decodedBuildingName = decodeURIComponent(buildingName)
  const { restrooms, countdown, loading } = useRestrooms()
  const building = groupRestroomsByBuilding(restrooms).find(item => item.name === decodedBuildingName)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!building) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Building not found</p>
        <Link to="/" className="text-red-500 hover:underline font-medium">← Back</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors mb-6 text-sm">
        <ArrowLeft size={16} />
        <span>Back to buildings</span>
      </Link>

      <div className={`rounded-3xl p-6 border mb-6 ${building.hasRedAlert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {building.hasRedAlert ? <AlertTriangle className="text-red-500" size={20} /> : <Building2 className="text-sky-600" size={20} />}
              <span className={`text-xs font-bold uppercase tracking-[0.28em] ${building.hasRedAlert ? 'text-red-500' : 'text-sky-600'}`}>
                Building overview
              </span>
            </div>
            <h1 className={`text-3xl font-black tracking-tight ${building.hasRedAlert ? 'text-red-700' : 'text-gray-900'}`}>
              {building.name}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {building.restroomCount} restroom entries across {building.floorCount} floors
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
          </div>

          <div className="text-left md:text-right">
            <div className={`text-5xl font-black leading-none ${building.hasRedAlert ? 'text-red-600' : 'text-gray-900'}`}>
              {building.averageRating > 0 ? building.averageRating.toFixed(1) : '—'}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-2">{building.totalReviews} total ratings</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 mt-6">
          <SummaryCard label="Poopability" value={building.pooperScore > 0 ? building.pooperScore.toFixed(1) : '—'} icon={<Droplets size={14} />} tone="sky" />
          <SummaryCard label="Cleanliness" value={building.cleanliness > 0 ? building.cleanliness.toFixed(1) : '—'} icon={<Sparkles size={14} />} tone="amber" />
          <SummaryCard label="Red Alerts" value={String(building.redAlertCount)} icon={<AlertTriangle size={14} />} tone="red" />
          <SummaryCard label="Reset Timer" value={countdown} icon={<Clock size={14} />} tone="slate" />
        </div>
      </div>

      <div className="space-y-4">
        {building.restrooms.map(restroom => (
          <RestroomBuildingCard key={restroom._id} restroom={restroom} />
        ))}
      </div>
    </div>
  )
}

function SummaryCard({ label, value, icon, tone }) {
  const tones = {
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-100',
  }

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-black mt-3">{value}</div>
    </div>
  )
}

function RestroomBuildingCard({ restroom }) {
  const scoreColor = (score) => {
    if (score >= 4) return 'text-green-600'
    if (score >= 3) return 'text-yellow-600'
    if (score >= 2) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className={`rounded-2xl border p-5 ${restroom.redAlert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {restroom.redAlert && <AlertTriangle className="text-red-500" size={16} />}
            <span className={`text-xs font-bold uppercase tracking-[0.24em] ${restroom.redAlert ? 'text-red-500' : 'text-sky-600'}`}>
              {restroom.floor}
            </span>
          </div>

          <h2 className={`text-xl font-black tracking-tight ${restroom.redAlert ? 'text-red-700' : 'text-gray-900'}`}>
            {restroom.name}
          </h2>
          <p className="text-sm text-gray-500 mt-2">{restroom.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
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
              <span className="text-[10px] text-gray-300 font-medium">Cleanliness</span>
            </div>
            {restroom.noFlushCount > 0 && (
              <span className="text-xs text-red-500 font-bold">🚫 {restroom.noFlushCount} no-flush reports</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 md:ml-6">
          <div className="text-left md:text-right">
            <div className={`text-4xl font-black leading-none ${restroom.redAlert ? 'text-red-600' : 'text-gray-900'}`}>
              {restroom.averageRating > 0 ? restroom.averageRating.toFixed(1) : '—'}
            </div>
            <div className="text-[10px] text-gray-400 font-medium mt-1">{restroom.totalReviews} ratings</div>
          </div>

          <Link
            to={`/restroom/${restroom._id}`}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              restroom.redAlert ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <span>View restroom details</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BuildingDetail
