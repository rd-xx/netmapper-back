import ValidationMiddleware from "../middlewares/ValidationMiddleware.js"
import FetchScanMiddleware from "../middlewares/FetchScanMiddleware.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"
import ScanModel from "../db/models/ScanModel.js"
import { ipSchema } from "../utils/schemas.js"
import scan from "../utils/scan.js"
import * as yup from "yup"
import {
  availableInputOptions,
  availableNoInputOptions,
} from "../utils/nmapOptions.js"

const commandSchema = yup.object().shape({
  target: ipSchema,
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

      scan(
        target,
        options, // Transforms 'p=80' into '-p 80'
        session.user,
        res
      )
    }
  )

  app.get("/nmap/scans", AuthMiddleware, async (req, res) => {
    const { session } = req.ctx
    const scans = await ScanModel.find({ user: session.user })

    res.send({ result: scans })
  })

  app.get(
    "/nmap/:scanId",
    AuthMiddleware,
    FetchScanMiddleware,
    async (req, res) => {
      const {
        session: { user },
        scan,
      } = req.ctx

      if (user.id !== scan.user.id) {
        res.status(403).send({ error: "Forbidden" })

        return
      }

      res.send({ result: scan })
    }
  )
}

export default prepareNmapRoutes
