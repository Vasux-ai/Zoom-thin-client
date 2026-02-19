import React, { useState, useCallback, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as Redux from 'redux'
import { thunk as ReduxThunk } from 'redux-thunk'
import { zoomSdk } from '../config/zoomSdk'
import { useZoomSignature } from './useZoomSignature'

const ZOOM_ROOT_ID = 'zmmtg-root'
const LEAVE_URL = window.location.origin + window.location.pathname

function exposeGlobalsForZoomSdk() {
  if (typeof window !== 'undefined') {
    window.React = window.React || React
    window.ReactDOM = window.ReactDOM || ReactDOM
    window.Redux = window.Redux || Redux
    window.ReduxThunk = window.ReduxThunk || ReduxThunk
    const R = window.React
    const key = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
    if (R && (!R[key] || !R[key].ReactCurrentBatchConfig)) {
      const existing = R[key] || {}
      R[key] = { ...existing, ReactCurrentBatchConfig: existing.ReactCurrentBatchConfig || { transition: null } }
    }
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

function loadCss(href) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) return resolve()
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))
    document.head.appendChild(link)
  })
}

async function loadZoomLocale(ZoomMtg, localeUrl) {
  if (!localeUrl || !ZoomMtg.i18n) return
  try {
    const res = await fetch(localeUrl)
    if (!res.ok) return
    const locale = await res.json()
    ZoomMtg.i18n.load(locale)
    ZoomMtg.i18n.reload(locale)
  } catch { }
}

const APP_BACKGROUND = '#e5e7eb'

function restoreAppBackground() {
  if (typeof document === 'undefined') return
  document.documentElement.style.backgroundColor = APP_BACKGROUND
  document.body.style.backgroundColor = APP_BACKGROUND
  const root = document.getElementById('root')
  if (root) root.style.backgroundColor = APP_BACKGROUND
}

async function ensureZoomSdkLoaded() {
  exposeGlobalsForZoomSdk()
  await loadCss(zoomSdk.cssUrl)
  await loadCss(zoomSdk.cssUrl2)
  restoreAppBackground()
  await loadScript(zoomSdk.scriptUrl)
  await loadScript(zoomSdk.scriptUrl2)
  await loadScript(zoomSdk.scriptUrl3)
  restoreAppBackground()
  const ZoomMtg = window.ZoomMtg
  if (!ZoomMtg) throw new Error('ERROR_ZOOM_SDK_LOAD')
  return ZoomMtg
}

export function useZoomJoin(options = {}) {
  const { localeUrl } = options
  const { getSignature } = useZoomSignature()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [joined, setJoined] = useState(false)
  const sdkReadyRef = useRef(false)

  const ensureSdkReady = useCallback(async () => {
    if (sdkReadyRef.current) return window.ZoomMtg
    const ZoomMtg = await ensureZoomSdkLoaded()
    ZoomMtg.setZoomJSLib('https://source.zoom.us/3.10.0/lib', '/av')
    await ZoomMtg.preLoadWasm()
    await ZoomMtg.prepareWebSDK()
    await loadZoomLocale(ZoomMtg, localeUrl)
    sdkReadyRef.current = true
    return ZoomMtg
  }, [localeUrl])

  const join = useCallback(
    async ({ meetingNumber, password, userName, userEmail }) => {
      setError(null)
      setLoading(true)
      restoreAppBackground()
      const rootEl = document.getElementById(ZOOM_ROOT_ID)
      if (rootEl) rootEl.style.display = 'block'
      try {
        const { signature, sdkKey } = await getSignature(meetingNumber, 0)
        const ZoomMtg = await ensureSdkReady()
        await new Promise((resolve, reject) => {
          ZoomMtg.init({
            leaveUrl: LEAVE_URL,
            disablePreview: true,
            success: () => resolve(),
            error: (err) => reject(err || new Error('ERROR_ZOOM_INIT_FAILED')),
          })
        })
        await new Promise((resolve, reject) => {
          ZoomMtg.join({
            signature,
            sdkKey,
            meetingNumber,
            passWord: password || '',
            userName: userName || 'Guest Participant', // Zoom SDK uses this; app UI uses translated placeholder
            userEmail: userEmail || '',
            success: () => {
              if (rootEl) rootEl.style.display = 'block'
              setJoined(true)
              resolve()
            },
            error: (err) => reject(err || new Error('ERROR_ZOOM_JOIN_FAILED')),
          })
        })
      } catch (err) {
        setError(err.message || 'ERROR_JOIN_FAILED')
        if (rootEl) rootEl.style.display = 'none'
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getSignature, ensureSdkReady]
  )

  return { join, loading, error, joined }
}

export { ZOOM_ROOT_ID }
