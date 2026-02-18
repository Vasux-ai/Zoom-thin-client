import { useState, useCallback, useEffect, useRef } from 'react'
import { parseMeetingInput, parseZoomUrl } from '../../utils/parseZoomUrl'
import styles from './JoinForm.module.css'

const DEFAULT_DISPLAY_NAME = 'Guest Participant'
const JOIN_PARAM = 'join'
const MEETING_PARAM = 'meetingNumber'
const PWD_PARAM = 'pwd'
const USERNAME_PARAM = 'username'

function getParam(params, ...keys) {
  for (const key of keys) {
    const v = params.get(key)
    if (v != null && v.trim() !== '') {
      try {
        return decodeURIComponent(v.trim())
      } catch {
        return v.trim()
      }
    }
  }
  return ''
}

function getMeetingFromParams(params) {
  const zoomUrl = params.get(JOIN_PARAM)
  if (zoomUrl) {
    try {
      const decoded = decodeURIComponent(zoomUrl.trim())
      const parsed = parseZoomUrl(decoded)
      if (parsed) return { meetingNumber: parsed.meetingNumber, password: parsed.password, meetingInput: decoded }
    } catch {
      // ignore
    }
  }
  const mn = (params.get(MEETING_PARAM) || params.get('meeting') || params.get('mn') || '').trim().replace(/\D/g, '')
  if (mn.length >= 9) {
    const pwd = getParam(params, PWD_PARAM, 'passcode', 'password')
    return { meetingNumber: mn, password: pwd, meetingInput: mn }
  }
  return null
}

function getInitialStateFromUrl() {
  if (typeof window === 'undefined') return { step: 1, meetingInput: '', passcode: '', displayName: '' }
  const params = new URLSearchParams(window.location.search)
  const meeting = getMeetingFromParams(params)
  const userName = getParam(params, USERNAME_PARAM, 'name', 'user')
  if (meeting) {
    return {
      step: 2,
      meetingInput: meeting.meetingInput,
      passcode: meeting.password || '',
      displayName: userName,
    }
  }
  return { step: 1, meetingInput: '', passcode: '', displayName: userName }
}

export function JoinForm({ onJoin, loading, error }) {
  const [step, setStep] = useState(() => getInitialStateFromUrl().step)
  const [meetingInput, setMeetingInput] = useState(() => getInitialStateFromUrl().meetingInput)
  const [passcode, setPasscode] = useState(() => getInitialStateFromUrl().passcode)
  const [displayName, setDisplayName] = useState(() => getInitialStateFromUrl().displayName)
  const [fieldError, setFieldError] = useState(null)
  const [bypassForm, setBypassForm] = useState(false)
  const autoJoinStartedRef = useRef(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const meeting = getMeetingFromParams(params)
    const userName = getParam(params, USERNAME_PARAM, 'name', 'user')

    if (meeting && userName && !autoJoinStartedRef.current) {
      autoJoinStartedRef.current = true
      setBypassForm(true)
      onJoin({
        meetingNumber: meeting.meetingNumber,
        password: meeting.password,
        userName,
      })
      return
    }
    if (meeting) {
      setMeetingInput(meeting.meetingInput)
      setPasscode(meeting.password || '')
      setStep(2)
      if (userName) setDisplayName(userName)
    }
  }, [onJoin])

  const meetingInfo = step === 2 ? parseMeetingInput(meetingInput, passcode) : null

  const handleStep1Submit = useCallback(
    (e) => {
      e.preventDefault()
      setFieldError(null)
      const parsed = parseMeetingInput(meetingInput, passcode)
      if (!parsed) {
        setFieldError('Please enter a valid meeting number or Zoom URL.')
        return
      }
      setStep(2)
    },
    [meetingInput, passcode]
  )

  const handleStep2Submit = useCallback(
    (e) => {
      e.preventDefault()
      setFieldError(null)
      const dName = displayName.trim()

      if (!dName) {
        setFieldError('Please enter your display name.')
        return
      }

      const parsed = parseMeetingInput(meetingInput, passcode)
      if (!parsed) {
        setFieldError('Invalid meeting info. Please go back and enter again.')
        return
      }
      onJoin({
        meetingNumber: parsed.meetingNumber,
        password: parsed.password,
        userName: dName,
      })
    },
    [meetingInput, passcode, displayName, onJoin]
  )

  const handleBack = useCallback(() => {
    setFieldError(null)
    setStep(1)
  }, [])

  const displayError = fieldError || error

  if (step === 1) {
    return (
      <form onSubmit={handleStep1Submit} className={styles.form} noValidate>
        <h1 className={styles.title}>Join Zoom Meeting</h1>
        <p className={styles.subtitle}>Enter meeting details</p>
        <label className={styles.label} htmlFor="meeting-input">Meeting number or URL</label>
        <input
          id="meeting-input"
          type="text"
          className={styles.input}
          placeholder="e.g. 74577211931 or https://zoom.us/j/74577211931"
          value={meetingInput}
          onChange={(e) => setMeetingInput(e.target.value)}
          disabled={loading}
          autoComplete="off"
          required
        />
        <label className={styles.label} htmlFor="passcode">Passcode <span className={styles.optional}>(if required)</span></label>
        <input
          id="passcode"
          type="text"
          className={styles.input}
          placeholder="Meeting passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
        {displayError && <div className={styles.error} role="alert">{displayError}</div>}
        <button type="submit" className={styles.button} disabled={loading}>Continue</button>
      </form>
    )
  }

  return (
    <form onSubmit={handleStep2Submit} className={styles.form} noValidate>
      <h1 className={styles.title}>Your name</h1>
      <p className={styles.subtitle}>Meeting: {meetingInfo?.meetingNumber}{meetingInfo?.password ? ' • Passcode entered' : ''}</p>
      <label className={styles.label} htmlFor="display-name">Display name</label>
      <input
        id="display-name"
        type="text"
        className={styles.input}
        placeholder={DEFAULT_DISPLAY_NAME}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        disabled={loading}
        autoComplete="name"
        required
      />
      {displayError && <div className={styles.error} role="alert">{displayError}</div>}
      <div className={styles.actions}>
        <button type="button" className={styles.buttonSecondary} onClick={handleBack} disabled={loading}>Back</button>
        <button type="submit" className={styles.button} disabled={loading}>{loading ? 'Joining…' : 'Join Meeting'}</button>
      </div>
    </form>
  )
}
