import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { MapPin, Star } from 'lucide-react'
import StarRating from './StarRating'

// Custom marker icon
const createIcon = (rating) => {
  const color = rating >= 4 ? '#22c55e' : rating >= 3 ? '#eab308' : rating >= 2 ? '#f97316' : '#ef4444'
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">${rating > 0 ? rating.toFixed(1) : '?'}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

function MapView({ restrooms, onSelectRestroom }) {
  const center = { lat: 35.9095, lng: -79.0475 }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={16}
      scrollWheelZoom={true}
      className="h-full w-full min-h-[500px]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restrooms.map(restroom => (
        <Marker
          key={restroom._id || restroom.id}
          position={[restroom.location.lat, restroom.location.lng]}
          icon={createIcon(restroom.averageRating || 0)}
          eventHandlers={{
            click: () => onSelectRestroom?.(restroom)
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-gray-900">{restroom.name}</h3>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <MapPin size={12} className="mr-1" />
                {restroom.building}
              </p>
              <div className="mt-2">
                <StarRating rating={restroom.averageRating || 0} size={14} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {restroom.totalReviews || 0} reviews
              </p>
              <Link
                to={`/restroom/${restroom._id || restroom.id}`}
                className="text-unc-blue text-sm font-medium mt-2 inline-block hover:underline"
              >
                View Details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView
