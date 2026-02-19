import { useMemo, useSyncExternalStore } from 'react'
import { getLangFromSearch, getTranslations, t as tFn } from './translations'

function subscribeToUrl(cb) {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}
function getUrlSnapshot() {
  return window.location.search
}

/**
 * Reads lang_code from URL (?lang_code=en|hi|mr) and returns lang + translation function.
 * Updates when URL search params change (e.g. navigation or popstate).
 */
export function useLanguage() {
  const search = useSyncExternalStore(subscribeToUrl, getUrlSnapshot, getUrlSnapshot)
  const lang = useMemo(() => getLangFromSearch(new URLSearchParams(search)), [search])
  const tr = useMemo(() => getTranslations(lang), [lang])
  const t = useMemo(() => (key) => tFn(lang, key), [lang])
  return { lang, t, tr }
}
