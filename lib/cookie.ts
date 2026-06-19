/**
 * Utility function to read a cookie from document.cookie on the client-side.
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  const nameLenPlus = name.length + 1
  const cookieArr = document.cookie.split(';')
  for (let i = 0; i < cookieArr.length; i++) {
    const c = cookieArr[i].trim()
    if (c.substring(0, nameLenPlus) === name + '=') {
      return decodeURIComponent(c.substring(nameLenPlus))
    }
  }
  return null
}
