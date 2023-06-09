import ValidationMiddleware from "../middlewares/ValidationMiddleware.js"
import hashPassword from "../utils/hashPassword.js"
import UserModel from "../db/models/UserModel.js"
import jsonwebtoken from "jsonwebtoken"
import config from "../utils/config.js"
import log from "../utils/log.js"
import * as yup from "yup"
import {
  usernameSchema,
  passwordSchema,
  emailSchema,
} from "../utils/schemas.js"

const signUpSchema = yup.object().shape({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
})

const signInSchema = yup.object().shape({
  email: emailSchema,
  password: yup.string().required(),
})

const prepareUserRoutes = (app) => {
  app.post("/sign-up", ValidationMiddleware(signUpSchema), async (req, res) => {
    const { username, email, password } = req.body
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      res.status(401).send({
        error: "This e-mail or username is already associated with an account.",
      })

      return
    }

    const [passwordHash, passwordSalt] = hashPassword(password)

    await new UserModel({
      username,
      email,
      passwordHash,
      passwordSalt,
    }).save()

    log.debug("Created user $s.", [username])

    res.send({ result: true })
  })

  app.post("/sign-in", ValidationMiddleware(signInSchema), async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })

    if (!user) {
      res.status(401).send({ error: "Invalid credentials" })

      return
    }

    const [passwordHash] = hashPassword(password, user.passwordSalt)

    if (passwordHash !== user.passwordHash) {
      res.status(401).send({ error: "Invalid credentials" })

      return
    }

    const jwt = jsonwebtoken.sign(
      {
        payload: {
          user: {
            id: String(user._id),
            username: user.username,
          },
        },
      },
      config.security.jwt.secret,
      {
        expiresIn: config.security.jwt.expiresIn,
      }
    )

    res.send({ result: jwt })
  })
}

export default prepareUserRoutes
