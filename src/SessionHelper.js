export default class SessionHelper {
  constructor(uuid, cacheLocation, timeoutInMinutes, debugMode = false) {
    this._uuid = `expiryTime${uuid}` // added 'expiryTime' to make it readable and easy to find for when you're debugging the localStorage
    this._debugMode = debugMode
    this._cacheLocation = cacheLocation
    this._timeoutInMinutes = timeoutInMinutes

    this._expiryTimeout = null
    this._expiryTimeoutCallback = null
  }

  /* expiry controls */
  get expiry() {
    let expiryFromStorage = null

    if (this._cacheLocation === 'localStorage') {
      expiryFromStorage = localStorage.getItem(this._uuid)
    } else if (this._cacheLocation === 'sessionStorage') {
      expiryFromStorage = sessionStorage.getItem(this._uuid)
    } else if (this._debugMode) { // eslint-disable-next-line no-console
      console.log('[SessionHelper] Invalid cache location used. Use "localStorage" or "sessionStorage".')
      return null
    }

    if (this._debugMode) { // eslint-disable-next-line no-console
      console.log('[SessionHelper] Expiry is set to', expiryFromStorage && new Date(expiryFromStorage * 1000))
    }
    return expiryFromStorage
  }
  setExpiry() {
    const now = Math.round(new Date().getTime() / 1000.0) // round it to nearest second
    const expiryTimestampInSeconds = now + (this._timeoutInMinutes * 60)

    if (this._cacheLocation === 'localStorage') {
      localStorage.setItem(this._uuid, expiryTimestampInSeconds)
    } else if (this._cacheLocation === 'sessionStorage') {
      sessionStorage.setItem(this._uuid, expiryTimestampInSeconds)
    } else if (this._debugMode) { // eslint-disable-next-line no-console
      console.log('[SessionHelper] Invalid cache location used. Use "localStorage" or "sessionStorage".')
      return null
    }

    if (this._debugMode) { // eslint-disable-next-line no-console
      console.log('[SessionHelper] Set expiry to', new Date(expiryTimestampInSeconds * 1000))
    }
    return expiryTimestampInSeconds
  }
  removeExpiry() {
    localStorage.removeItem(this._uuid)
    sessionStorage.removeItem(this._uuid)

    if (this._debugMode) { // eslint-disable-next-line no-console
      console.log('[SessionHelper] Expiry removed from storage')
    }
  }

  /* is token expired */
  get isTokenExpired() {
    const now = Math.round(new Date().getTime() / 1000.0)
    const expiryTimestamp = this.expiry
    const isTokenExpired =
      window === window.parent &&
      window === window.top &&
      expiryTimestamp !== null &&
      now > expiryTimestamp

    if (this._debugMode) { // eslint-disable-next-line no-console
      console.log('[SessionHelper] Token is expired', isTokenExpired)
    }
    return isTokenExpired
  }

  /* is token expired or null */
  get isTokenExpiredOrNull() {
    const { isTokenExpired } = this
    const isExpiryNull = this.expiry === null // means the user had an other tab open which triggered the timeout already
    if (this._debugMode) {
      if (isTokenExpired) { // eslint-disable-next-line no-console
        console.log('[SessionHelper] Token is expired')
      }
      if (isExpiryNull) { // eslint-disable-next-line no-console
        console.log('[SessionHelper] Token is null')
      }
    }
    return isTokenExpired || isExpiryNull
  }

  /* expiry timeout */
  get expiryTimeout() {
    if (typeof this.expiryTimeoutCallback === 'function' && this._expiryTimeout !== null) {
      // return the remaining time until timer has finished
      const now = Math.round(new Date().getTime() / 1000.0)
      const expiryTimestamp = this.expiry
      const timeTillExpiryInSeconds = expiryTimestamp - now
      if (this._debugMode) { // eslint-disable-next-line no-console
        console.log(`[SessionHelper] Token expiry timeout function will be triggered in roughly ${Math.round(timeTillExpiryInSeconds / 60)} minute(s) at ${new Date(expiryTimestamp * 1000)}.`)
      }
      return timeTillExpiryInSeconds
    }
    if (this._debugMode) { // eslint-disable-next-line no-console
      console.log('[SessionHelper] Token expiry timeout function is not set.')
    }
    return null
  }

  /* expiry timeout callback */
  get expiryTimeoutCallback() {
    return this._expiryTimeoutCallback
  }
  set expiryTimeoutCallback(callback) {
    this._expiryTimeoutCallback = callback
  }

  /* timeout controls */
  startExpiryTimeout() {
    const that = this
    this._expiryTimeout = setTimeout(() => {
      that.expiryTimeoutCallback()
    }, (this._timeoutInMinutes * 60 * 1000) + 1000) // add 1 second to counter rounding errors
    if (this._debugMode) { // eslint-disable-next-line no-console
      console.log(`[SessionHelper] Token expiry timeout function will be triggered in roughly ${Math.round(this._timeoutInMinutes)} minute(s) at ${new Date(this.expiry * 1000)}.`)
    }
  }
  stopExpiryTimeout() {
    clearTimeout(this._expiryTimeout)
  }
  resetExpiryTimeout() {
    this.stopExpiryTimeout()
    this.startExpiryTimeout()
  }
}
