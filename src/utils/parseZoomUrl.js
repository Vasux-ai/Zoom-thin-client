/**
 * Parse a Zoom Meeting or Webinar URL into meeting number and password.
 * Supports: /j/, /w/, /s/, /wc/.../start and ?pwd=
 */
export function parseZoomUrl(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  let parsed
  try {
    parsed = new URL(trimmed)
  } catch {
    return null
  }
  const host = parsed.hostname.toLowerCase()
  if (!host.includes('zoom.us') && !host.includes('zoom.com')) return null
  const segments = parsed.pathname.replace(/^\/+/, '').split('/').filter(Boolean)
  const meetingSegment = segments.find((_, i) => {
    const prev = segments[i - 1]
    return prev === 'j' || prev === 'w' || prev === 's' || prev === 'wc'
  })
  const meetingNumber = meetingSegment ? meetingSegment.replace(/\D/g, '') : null
  if (!meetingNumber || meetingNumber.length < 9) return null
  const password = parsed.searchParams.get('pwd')?.trim() || ''
  return { meetingNumber, password }
}

/**
 * Parse meeting number and password from Zoom URL or plain meeting number + passcode.
 */
export function parseMeetingInput(meetingInput, passcode = '') {
  if (!meetingInput || typeof meetingInput !== 'string') return null
  const trimmed = meetingInput.trim()
  if (!trimmed) return null
  const looksLikeUrl = trimmed.startsWith('http') || trimmed.includes('zoom.us') || trimmed.includes('zoom.com')
  if (looksLikeUrl) {
    try {
      const parsed = parseZoomUrl(trimmed)
      if (parsed) {
        const password = (passcode && passcode.trim()) || parsed.password
        return { meetingNumber: parsed.meetingNumber, password }
      }
    } catch {
      return null
    }
    return null
  }
  const meetingNumber = trimmed.replace(/\D/g, '')
  if (meetingNumber.length < 9) return null
  return { meetingNumber, password: (passcode && passcode.trim()) || '' }
}
