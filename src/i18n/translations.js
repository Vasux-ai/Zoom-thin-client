/**
 * Translations for en (English), hi (Hindi), mr (Marathi).
 * Language is set via URL param: ?lang_code=en|hi|mr
 */
export const translations = {
  en: {
    // Step 1: Meeting number & passcode
    titleJoin: 'Join Zoom Meeting',
    subtitleMeetingDetails: 'Enter meeting details',
    labelMeetingNumber: 'Meeting number or URL',
    placeholderMeetingExample: 'e.g. 74577211931 or https://zoom.us/j/74577211931',
    labelPasscode: 'Passcode',
    optionalIfRequired: '(if required)',
    placeholderPasscode: 'Meeting passcode',
    buttonContinue: 'Continue',
    // Step 2: Your name
    titleYourName: 'Your name',
    subtitleMeeting: 'Meeting:',
    passcodeEntered: 'Passcode entered',
    labelDisplayName: 'Display name',
    placeholderGuestName: 'Guest Participant',
    buttonBack: 'Back',
    buttonJoinMeeting: 'Join Meeting',
    joining: 'Joining Meeting...',
    joiningMeeting: 'Joining Meeting...',
    // Validation & errors
    errorInvalidMeeting: 'Please enter a valid meeting number or Zoom URL.',
    errorEnterDisplayName: 'Please enter your display name.',
    errorInvalidMeetingGoBack: 'Invalid meeting info. Please go back and enter again.',
    // Error keys (from API / join flow)
    ERROR_MISSING_CREDENTIALS: 'Missing Zoom credentials. Add VITE_ZOOM_SDK_KEY and VITE_ZOOM_SDK_SECRET to your .env file.',
    ERROR_SIGNATURE_FAILED: 'Failed to get signature',
    ERROR_SERVER_NOT_RUNNING: 'Signature server is not running. Start the app with: npm run dev',
    ERROR_CANNOT_REACH_SERVER: 'Cannot reach the server. Use npm run dev and try again, or check your network.',
    ERROR_JOIN_FAILED: 'Failed to join meeting',
    ERROR_ZOOM_INIT_FAILED: 'Zoom init failed',
    ERROR_ZOOM_JOIN_FAILED: 'Zoom join failed',
    ERROR_ZOOM_SDK_LOAD: 'Zoom Meeting SDK failed to load',
  },
  hi: {
    titleJoin: 'ज़ूम मीटिंग में शामिल हों',
    subtitleMeetingDetails: 'मीटिंग विवरण दर्ज करें',
    labelMeetingNumber: 'मीटिंग नंबर या URL',
    placeholderMeetingExample: 'जैसे 74577211931 या https://zoom.us/j/74577211931',
    labelPasscode: 'पासकोड',
    optionalIfRequired: '(अगर ज़रूरी हो)',
    placeholderPasscode: 'मीटिंग पासकोड',
    buttonContinue: 'जारी रखें',
    titleYourName: 'आपका नाम',
    subtitleMeeting: 'मीटिंग:',
    passcodeEntered: 'पासकोड दर्ज किया',
    labelDisplayName: 'प्रदर्शित नाम',
    placeholderGuestName: 'अतिथि प्रतिभागी',
    buttonBack: 'वापस',
    buttonJoinMeeting: 'मीटिंग में शामिल हों',
    joining: 'मीटिंग में शामिल हो रहे हैं...',
    joiningMeeting: 'मीटिंग में शामिल हो रहे हैं...',
    errorInvalidMeeting: 'कृपया एक वैध मीटिंग नंबर या ज़ूम URL दर्ज करें।',
    errorEnterDisplayName: 'कृपया अपना प्रदर्शित नाम दर्ज करें।',
    errorInvalidMeetingGoBack: 'अमान्य मीटिंग जानकारी। कृपया वापस जाएं और फिर से दर्ज करें।',
    ERROR_MISSING_CREDENTIALS: 'ज़ूम क्रेडेंशियल गायब हैं। .env फ़ाइल में VITE_ZOOM_SDK_KEY और VITE_ZOOM_SDK_SECRET जोड़ें।',
    ERROR_SIGNATURE_FAILED: 'सिग्नेचर प्राप्त करने में विफल',
    ERROR_SERVER_NOT_RUNNING: 'सिग्नेचर सर्वर चल नहीं रहा। ऐप शुरू करें: npm run dev',
    ERROR_CANNOT_REACH_SERVER: 'सर्वर तक पहुँच नहीं सकते। npm run dev चलाएं और पुनः प्रयास करें, या नेटवर्क जांचें।',
    ERROR_JOIN_FAILED: 'मीटिंग में शामिल होने में विफल',
    ERROR_ZOOM_INIT_FAILED: 'ज़ूम इनिट विफल',
    ERROR_ZOOM_JOIN_FAILED: 'ज़ूम जॉइन विफल',
    ERROR_ZOOM_SDK_LOAD: 'ज़ूम मीटिंग SDK लोड विफल',
  },
  mr: {
    titleJoin: 'झूम मीटिंगमध्ये सामील व्हा',
    subtitleMeetingDetails: 'मीटिंग तपशील प्रविष्ट करा',
    labelMeetingNumber: 'मीटिंग नंबर किंवा URL',
    placeholderMeetingExample: 'उदा. 74577211931 किंवा https://zoom.us/j/74577211931',
    labelPasscode: 'पासकोड',
    optionalIfRequired: '(आवश्यक असल्यास)',
    placeholderPasscode: 'मीटिंग पासकोड',
    buttonContinue: 'सुरू ठेवा',
    titleYourName: 'तुमचे नाव',
    subtitleMeeting: 'मीटिंग:',
    passcodeEntered: 'पासकोड प्रविष्ट केला',
    labelDisplayName: 'प्रदर्शित नाव',
    placeholderGuestName: 'अतिथी सहभागी',
    buttonBack: 'मागे',
    buttonJoinMeeting: 'मीटिंगमध्ये सामील व्हा',
    joining: 'मीटिंगमध्ये सामील होत आहे...',
    joiningMeeting: 'मीटिंगमध्ये सामील होत आहे...',
    errorInvalidMeeting: 'कृपया वैध मीटिंग नंबर किंवा झूम URL प्रविष्ट करा.',
    errorEnterDisplayName: 'कृपया तुमचे प्रदर्शित नाव प्रविष्ट करा.',
    errorInvalidMeetingGoBack: 'अवैध मीटिंग माहिती. कृपया मागे जा आणि पुन्हा प्रविष्ट करा.',
    ERROR_MISSING_CREDENTIALS: 'झूम क्रेडेंशियल्स गहाळ. .env फाइलमध्ये VITE_ZOOM_SDK_KEY आणि VITE_ZOOM_SDK_SECRET जोडा.',
    ERROR_SIGNATURE_FAILED: 'सही मिळवण्यात अयशस्वी',
    ERROR_SERVER_NOT_RUNNING: 'सही सर्व्हर चालत नाही. ऍप सुरू करा: npm run dev',
    ERROR_CANNOT_REACH_SERVER: 'सर्व्हर गाठता येत नाही. npm run dev चालवा आणि पुन्हा प्रयत्न करा किंवा नेटवर्क तपासा.',
    ERROR_JOIN_FAILED: 'मीटिंगमध्ये सामील होण्यात अयशस्वी',
    ERROR_ZOOM_INIT_FAILED: 'झूम इनिट अयशस्वी',
    ERROR_ZOOM_JOIN_FAILED: 'झूम जॉईन अयशस्वी',
    ERROR_ZOOM_SDK_LOAD: 'झूम मीटिंग SDK लोड अयशस्वी',
  },
}

const DEFAULT_LANG = 'en'
const LANG_PARAM = 'lang_code'
const SUPPORTED = ['en', 'hi', 'mr']

export function getLangFromUrl() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const params = new URLSearchParams(window.location.search)
  return getLangFromSearch(params)
}

/** Parse lang from URLSearchParams (for use with any search string). */
export function getLangFromSearch(params) {
  if (!params) return DEFAULT_LANG
  const code = (params.get(LANG_PARAM) || params.get('lang') || '').toLowerCase().trim()
  return SUPPORTED.includes(code) ? code : DEFAULT_LANG
}

export function getTranslations(lang) {
  return translations[lang] || translations[DEFAULT_LANG]
}

/**
 * Translate a key. Keys can be simple (e.g. 'titleJoin') or error keys (e.g. 'ERROR_MISSING_CREDENTIALS').
 * If the key is not found, returns the key itself (so raw error messages still show).
 */
export function t(lang, key) {
  if (!key || typeof key !== 'string') return ''
  const tr = getTranslations(lang)
  return tr[key] != null ? tr[key] : key
}
