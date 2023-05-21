import ValidationMiddleware from "../middlewares/ValidationMiddleware.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"
import { ipValidator } from "../utils/validators.js"
import scan from "../utils/scan.js"
import * as yup from "yup"
import {
  availableInputOptions,
  availableNoInputOptions,
} from "../utils/nmapOptions.js"

const commandSchema = yup.object().shape({
  target: ipValidator,
  options: yup
    .array()
    .of(
      yup
        .string()
        .test(
          "valid",
          "Invalid options",
          (value) =>
            availableNoInputOptions.includes(value) ||
            availableInputOptions
              .map((x) => value.match(x.validator))
              .some((x) => x !== null)
        )
    )
    .required()
    .label("Options"),
})

const prepareNmapRoutes = (app) => {
  app.get("/nmap/options", AuthMiddleware, async (_, res) => {
    res.send({
      result: {
        inputOptions: availableInputOptions.map((x) => ({
          option: x.option,
          vaidator: x.validator.toString(),
        })),
        noInputOptions: availableNoInputOptions,
      },
    })
  })

  app.post(
    "/nmap/scan",
    AuthMiddleware,
    ValidationMiddleware(commandSchema),
    async (req, res) => {
      const { target, options } = req.body
      const { session } = req.ctx

      await scan(target, options, session.user)
      res.send({ message: "ok" })
    }
  )
}

export default prepareNmapRoutes
