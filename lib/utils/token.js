import SignJWT from 'jose/jwt/sign'
import jwtVerify from 'jose/jwt/verify'
import parseJwk from 'jose/jwk/parse'

export const generateToken = async (userId = -1) => {
  const privateKey = await parseJwk({
    alg: 'ES256',
    crv: 'P-256',
    kty: 'EC',
    use: 'sig',
    d: 'XsY3GHzDNKt0U6WObOdScFRNuHhHw1fyquyx7OlfHLo',
    x: 'VdnlfEycT3NtEGo9sw487Mdvx-mv2DF225MZ6uC6weA',
    y: 'F3KpzXyjvOPQyUZ60tiMrA7-sIaia9zNHrTizC3Roho',
  })

  return await new SignJWT({
    userId,
  })
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuer('chuckchuck')
    .setIssuedAt(Date.now())
    .setSubject('user')
    .setExpirationTime('1d')
    .sign(privateKey)
}

export const verifyToken = async (token = '') => {
  const publicKey = await parseJwk({
    alg: 'ES256',
    crv: 'P-256',
    kty: 'EC',
    x: 'VdnlfEycT3NtEGo9sw487Mdvx-mv2DF225MZ6uC6weA',
    y: 'F3KpzXyjvOPQyUZ60tiMrA7-sIaia9zNHrTizC3Roho',
  })

  try {
    const { payload, protectedHeader } = await jwtVerify(token, publicKey)

    return payload
  } catch (err) {
    return false
  }
}
