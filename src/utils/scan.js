import ScanModel from "../db/models/ScanModel.js"
import { spawn } from "child_process"
import log from "./log.js"

const scan = async (target, options, user) => {
  const ls = spawn("nmap", [target])
  let scanId = null

  log.debug("$s started scanning $s.", [user.username, target])

  ls.stdout.on("data", async (data) => {
    if (!scanId) {
      const instance = await new ScanModel({
        target,
        options,
        response: data.toString(),
        user,
      }).save()

      scanId = instance._id
    } else {
      await ScanModel.findByIdAndUpdate(scanId, {
        $push: {
          response: data.toString(),
        },
      })
    }
  })

  ls.stderr.on("data", async (data) => {
    await ScanModel.findByIdAndUpdate(scanId, {
      $push: {
        error: data.toString(),
      },
    })
  })

  ls.on("close", async (code) => {
    await ScanModel.findByIdAndUpdate(scanId, {
      status: "done",
    })

    log.debug("$s finished scanning $s. Completed with code $s.", [
      user.username,
      target,
      code,
    ])
  })
}

export default scan
