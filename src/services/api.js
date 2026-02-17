import { createZoomSignature } from '../utils/signature'

const sdkKey = import.meta.env.VITE_ZOOM_SDK_KEY || ''
const sdkSecret = import.meta.env.VITE_ZOOM_SDK_SECRET || ''

export async function postSignature(meetingNumber, role = 0) {
  if (!sdkKey || !sdkSecret) {
    throw new Error('Missing Zoom credentials. Add VITE_ZOOM_SDK_KEY and VITE_ZOOM_SDK_SECRET to your .env file.')
  }
  const signature = await createZoomSignature(sdkKey, sdkSecret, meetingNumber, role)
  return { signature, sdkKey }
}
