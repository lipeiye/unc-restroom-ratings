import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { UNC_RESTROOMS, BUILDINGS } from '../data/uncRestrooms'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function useRestrooms() {
  const [restrooms, setRestrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [socket, setSocket] = useState(null)

  // Seed local data if DB is not available
  const seedLocalData = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/api/restrooms/seed`, UNC_RESTROOMS)
    } catch (err) {
      console.log('Using local data (DB may not be connected)')
    }
  }, [])

  const fetchRestrooms = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/restrooms`)
      setRestrooms(response.data)
      setError(null)
    } catch (err) {
      // Fallback to local data
      setRestrooms(UNC_RESTROOMS.map((r, i) => ({ ...r, _id: `local-${i}` })))
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    seedLocalData().then(() => fetchRestrooms())

    // Setup Socket.io for real-time updates
    const newSocket = io(API_URL)
    setSocket(newSocket)

    newSocket.on('newReview', (data) => {
      setRestrooms(prev => prev.map(r => {
        if (r._id === data.restroomId) {
          return {
            ...r,
            averageRating: data.restroomUpdate.averageRating,
            totalReviews: data.restroomUpdate.totalReviews
          }
        }
        return r
      }))
    })

    return () => newSocket.close()
  }, [fetchRestrooms, seedLocalData])

  const filterRestrooms = useCallback((filters) => {
    let filtered = [...restrooms]
    
    if (filters.building) {
      filtered = filtered.filter(r => r.building === filters.building)
    }
    if (filters.minRating) {
      filtered = filtered.filter(r => (r.averageRating || 0) >= filters.minRating)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(search) ||
        r.building.toLowerCase().includes(search)
      )
    }
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(r => 
        filters.tags.some(tag => r.tags?.includes(tag))
      )
    }
    
    return filtered
  }, [restrooms])

  return {
    restrooms,
    loading,
    error,
    buildings: BUILDINGS,
    fetchRestrooms,
    filterRestrooms,
    socket
  }
}

export function useRestroomDetail(restroomId) {
  const [restroom, setRestroom] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRestroom = useCallback(async () => {
    try {
      setLoading(true)
      const [restroomRes, reviewsRes] = await Promise.all([
        axios.get(`${API_URL}/api/restrooms/${restroomId}`),
        axios.get(`${API_URL}/api/reviews/${restroomId}`)
      ])
      setRestroom(restroomRes.data)
      setReviews(reviewsRes.data)
    } catch (err) {
      // Fallback to local data
      const local = UNC_RESTROOMS[parseInt(restroomId.replace('local-', ''))]
      if (local) {
        setRestroom({ ...local, _id: restroomId })
      }
    } finally {
      setLoading(false)
    }
  }, [restroomId])

  const submitReview = useCallback(async (reviewData) => {
    const response = await axios.post(
      `${API_URL}/api/reviews/${restroomId}`,
      reviewData
    )
    setReviews(prev => [response.data, ...prev])
    return response.data
  }, [restroomId])

  useEffect(() => {
    fetchRestroom()
  }, [fetchRestroom])

  return { restroom, reviews, loading, fetchRestroom, submitReview }
}
