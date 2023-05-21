import prepareUserRoutes from "./routes/prepareUserRoutes.js"
import prepareNmapRoutes from "./routes/prepareNmapRoutes.js"
import config from "./utils/config.js"
import mongoose from "mongoose"
import express from "express"
import cors from "cors"

await mongoose.connect(config.db.uri)

const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  req.ctx = {
    util: {
      handleNotFound: (x) => {
        if (!x) {
          res.status(404).send({ error: "Not found" })

          return true
        }

        return false
      },
    },
  }

  next()
})

prepareUserRoutes(app)
prepareNmapRoutes(app)
app.use(function (_, res) {
  res.status(404).send({ error: "Not found" })
})

app.listen(config.port, () => console.log(`Listening on: ${config.port}`))
