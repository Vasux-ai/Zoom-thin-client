const ZOOM_SDK_VERSION = '3.10.0'
const ZOOM_CDN = 'https://source.zoom.us'
const VENDOR_CDN = 'https://cdnjs.cloudflare.com/ajax/libs'

export const zoomSdk = {
  version: ZOOM_SDK_VERSION,
  scriptUrl: `${VENDOR_CDN}/jquery/3.6.0/jquery.min.js`,
  scriptUrl2: `${VENDOR_CDN}/lodash.js/4.17.21/lodash.min.js`,
  scriptUrl3: `${ZOOM_CDN}/${ZOOM_SDK_VERSION}/zoom-meeting-${ZOOM_SDK_VERSION}.min.js`,
  cssUrl: `${ZOOM_CDN}/${ZOOM_SDK_VERSION}/css/bootstrap.css`,
  cssUrl2: `${ZOOM_CDN}/${ZOOM_SDK_VERSION}/css/react-select.css`,
}
