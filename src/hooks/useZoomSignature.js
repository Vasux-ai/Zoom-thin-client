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
      const msg = err.message || 'ERROR_SIGNATURE_FAILED'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { getSignature, loading, error }
}
