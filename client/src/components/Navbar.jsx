import { Link } from 'react-router-dom'
import { MapPin, Star, Bath } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-unc-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <Bath className="h-8 w-8 text-unc-blue" />
            <div>
              <h1 className="text-white text-xl font-bold">UNC Restroom Ratings</h1>
              <p className="text-unc-blue text-xs">Find the best bathrooms on campus</p>
            </div>
          </Link>
          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-unc-blue" />
              <span>Chapel Hill, NC</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>Real-time Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
