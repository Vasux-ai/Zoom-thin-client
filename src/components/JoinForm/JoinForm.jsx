import { useState, useCallback, useEffect, useRef } from 'react'
import { parseMeetingInput, parseZoomUrl } from '../../utils/parseZoomUrl'
import { useLanguage } from '../../i18n/useLanguage'
import styles from './JoinForm.module.css'

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
  const hasPasscode = meeting && (meeting.password || '').trim() !== ''
  if (meeting && hasPasscode) {
    return {
      step: 2,
      meetingInput: meeting.meetingInput,
      passcode: meeting.password || '',
      displayName: userName,
    }
  }
  if (meeting) {
    return { step: 1, meetingInput: meeting.meetingInput, passcode: meeting.password || '', displayName: userName }
  }
  const passcodeOnly = getParam(params, PWD_PARAM, 'passcode', 'password')
  return { step: 1, meetingInput: '', passcode: passcodeOnly, displayName: userName }
}

export function JoinForm({ onJoin, loading, error }) {
  const { t, lang } = useLanguage()
  const [step, setStep] = useState(() => getInitialStateFromUrl().step)
  useEffect(() => {
    document.title = step === 1 ? t('titleJoin') : t('titleYourName')
    const html = document.documentElement
    if (lang === 'hi') html.setAttribute('lang', 'hi')
    else if (lang === 'mr') html.setAttribute('lang', 'mr')
    else html.setAttribute('lang', 'en')
  }, [lang, step, t])
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
    const hasPasscode = meeting && (meeting.password || '').trim() !== ''

    if (meeting && hasPasscode && userName && !autoJoinStartedRef.current) {
      autoJoinStartedRef.current = true
      setBypassForm(true)
      onJoin({
        meetingNumber: meeting.meetingNumber,
        password: meeting.password,
        userName,
      })
      return
    }
    if (meeting && hasPasscode) {
      setMeetingInput(meeting.meetingInput)
      setPasscode(meeting.password || '')
      setStep(2)
      if (userName) setDisplayName(userName)
    } else if (meeting) {
      setMeetingInput(meeting.meetingInput)
      setPasscode(meeting.password || '')
      setStep(1)
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
        setFieldError(t('errorInvalidMeeting'))
        return
      }
      setStep(2)
    },
    [meetingInput, passcode, t]
  )

  const handleStep2Submit = useCallback(
    (e) => {
      e.preventDefault()
      setFieldError(null)
      const dName = displayName.trim()

      if (!dName) {
        setFieldError(t('errorEnterDisplayName'))
        return
      }

      const parsed = parseMeetingInput(meetingInput, passcode)
      if (!parsed) {
        setFieldError(t('errorInvalidMeetingGoBack'))
        return
      }
      onJoin({
        meetingNumber: parsed.meetingNumber,
        password: parsed.password,
        userName: dName,
      })
    },
    [meetingInput, passcode, displayName, onJoin, t]
  )

  const handleBack = useCallback(() => {
    setFieldError(null)
    setStep(1)
  }, [])

  const rawError = fieldError || error
  const displayError = rawError ? t(rawError) : null

  if (step === 1) {
    return (
      <form onSubmit={handleStep1Submit} className={styles.form} noValidate>
        <h1 className={styles.title}>{t('titleJoin')}</h1>
        <p className={styles.subtitle}>{t('subtitleMeetingDetails')}</p>
        <label className={styles.label} htmlFor="meeting-input">{t('labelMeetingNumber')}</label>
        <input
          id="meeting-input"
          type="text"
          className={styles.input}
          placeholder={t('placeholderMeetingExample')}
          value={meetingInput}
          onChange={(e) => setMeetingInput(e.target.value)}
          disabled={loading}
          autoComplete="off"
          required
        />
        <label className={styles.label} htmlFor="passcode">{t('labelPasscode')} <span className={styles.optional}>{t('optionalIfRequired')}</span></label>
        <input
          id="passcode"
          type="text"
          className={styles.input}
          placeholder={t('placeholderPasscode')}
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
        {displayError && <div className={styles.error} role="alert">{displayError}</div>}
        <button type="submit" className={styles.button} disabled={loading}>{t('buttonContinue')}</button>
      </form>
    )
  }

  return (
    <form onSubmit={handleStep2Submit} className={styles.form} noValidate>
      <h1 className={styles.title}>{t('titleYourName')}</h1>
      <p className={styles.subtitle}>{t('subtitleMeeting')} {meetingInfo?.meetingNumber}{meetingInfo?.password ? ` • ${t('passcodeEntered')}` : ''}</p>
      <label className={styles.label} htmlFor="display-name">{t('labelDisplayName')}</label>
      <input
        id="display-name"
        type="text"
        className={styles.input}
        placeholder={t('placeholderGuestName')}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        disabled={loading}
        autoComplete="name"
        required
      />
      {displayError && <div className={styles.error} role="alert">{displayError}</div>}
      <div className={styles.actions}>
        <button type="button" className={styles.buttonSecondary} onClick={handleBack} disabled={loading}>{t('buttonBack')}</button>
        <button type="submit" className={styles.button} disabled={loading}>{loading ? t('joining') : t('buttonJoinMeeting')}</button>
      </div>
    </form>
  )
}
