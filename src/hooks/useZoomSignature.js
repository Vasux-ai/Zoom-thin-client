import { useState, useCallback } from 'react'
import { postSignature } from '../services/api'

export function useZoomSignature() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getSignature = useCallback(async (meetingNumber, role = 0) => {
    setError(null)
    setLoading(true)
    try {
      return await postSignature(meetingNumber, role)
    } catch (err) {
      setError(err.message || 'Failed to get signature')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { getSignature, loading, error }
}
