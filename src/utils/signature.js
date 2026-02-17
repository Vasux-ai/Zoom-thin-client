/**
 * Generate Zoom Meeting SDK JWT signature in the frontend (Web Crypto).
 */
function base64UrlEncode(input) {
  const bytes = new Uint8Array(input)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function strToBytes(str) {
  return new TextEncoder().encode(str)
}

export async function createZoomSignature(sdkKey, sdkSecret, meetingNumber, role) {
  const iat = Math.floor(Date.now() / 1000) - 30
  const exp = iat + 60 * 60 * 2
  const tokenExp = exp * 1000
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = { sdkKey, mn: meetingNumber, role: Number(role), iat, exp, tokenExp }
  const headerB64 = base64UrlEncode(strToBytes(JSON.stringify(header)))
  const payloadB64 = base64UrlEncode(strToBytes(JSON.stringify(payload)))
  const signatureInput = `${headerB64}.${payloadB64}`
  const key = await crypto.subtle.importKey('raw', strToBytes(sdkSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sigBuffer = await crypto.subtle.sign('HMAC', key, strToBytes(signatureInput))
  const sigB64 = base64UrlEncode(sigBuffer)
  return `${signatureInput}.${sigB64}`
}
