import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import BuildingDetail from './pages/BuildingDetail'
import RestroomDetail from './pages/RestroomDetail'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/building/:buildingName" element={<BuildingDetail />} />
        <Route path="/restroom/:id" element={<RestroomDetail />} />
      </Routes>
    </div>
  )
}

export default App
