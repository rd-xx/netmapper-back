import jsonwebtoken from "jsonwebtoken"
import config from "../utils/config.js"

const AuthMiddleware = (req, res, next) => {
  const { authorization } = req.headers
  const jwt = authorization?.slice(7)

  if (!jwt) {
    res.status(403).send({ error: "Forbidden" })

    return
  }

  try {
    const { payload } = jsonwebtoken.verify(jwt, config.security.jwt.secret)

    req.ctx.session = payload

    next()
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    console.error(err)

    res.status(500).send({ error: "Oops. Something went wrong." })
  }
}

export default AuthMiddleware
