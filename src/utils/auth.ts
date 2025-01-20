// src/utils/auth.ts

/**
 * Safely get the auth token from localStorage
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('auth_token')
  } catch {
    return null
  }
}

/**
 * Decode a JWT to extract payload
 */
export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

/**
 * Extract the role claim from the JWT
 */
export const getUserRole = () => {
  try {
    const token = getAuthToken()
    if (!token) return null

    const decodedToken = parseJwt(token)
    return decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  } catch {
    return null
  }
}
