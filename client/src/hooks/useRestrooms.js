import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export function useRestrooms() {
  const [restrooms, setRestrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastReset, setLastReset] = useState(null)
  const [countdown, setCountdown] = useState('')

  const fetchRestrooms = useCallback(async () => {
    try {
      setLoading(true)
      const [restRes, resetRes] = await Promise.all([
        axios.get(`${API_URL}/api/restrooms`),
        axios.get(`${API_URL}/api/restrooms/meta/last-reset`)
      ])
      setRestrooms(restRes.data)
      setLastReset(resetRes.data.lastReset)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const submitRating = useCallback(async (restroomId, rating) => {
    const res = await axios.post(`${API_URL}/api/reviews/rate/${restroomId}`, { rating })
    return res.data
  }, [])

  const submitNoFlush = useCallback(async (restroomId) => {
    const res = await axios.post(`${API_URL}/api/reviews/noflush/${restroomId}`)
    return res.data
  }, [])

  const createRestroom = useCallback(async (data) => {
    const res = await axios.post(`${API_URL}/api/restrooms`, data)
    setRestrooms(prev => [...prev, res.data].sort((a, b) => {
      if (a.redAlert !== b.redAlert) return b.redAlert - a.redAlert
      return b.averageRating - a.averageRating
    }))
    return res.data
  }, [])

  // Countdown to 8 PM
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const reset = new Date()
      reset.setHours(20, 0, 0, 0)
      if (reset <= now) reset.setDate(reset.getDate() + 1)
      const diff = reset - now
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${h}h ${m}m ${s}s`)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchRestrooms()
    const socket = io(API_URL)

    socket.on('ratingUpdate', ({ restroom }) => {
      setRestrooms(prev => prev.map(r => r._id === restroom._id ? restroom : r).sort((a, b) => {
        if (a.redAlert !== b.redAlert) return b.redAlert - a.redAlert
        return b.averageRating - a.averageRating
      }))
    })

    socket.on('dataReset', () => fetchRestrooms())
    return () => socket.close()
  }, [fetchRestrooms])

  return { restrooms, loading, lastReset, countdown, fetchRestrooms, submitRating, submitNoFlush, createRestroom }
}
