import * as yup from "yup"

const ValidationMiddleware = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
    })

    return next()
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      res.status(400).send({ errors: err.errors })

      return
    }

    res.status(400).send({ error: "Invalid body." })
  }
}

export default ValidationMiddleware
