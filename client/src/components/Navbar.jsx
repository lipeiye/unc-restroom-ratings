import { Link } from 'react-router-dom'
import { AlertTriangle, Clock } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🚻</span>
            <div>
              <h1 className="text-white text-lg font-bold leading-tight">UNC Restrooms</h1>
            </div>
          </Link>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <AlertTriangle size={12} className="text-red-400" />
              <span>Red Alert = Bad</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>Resets 8PM Daily</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
