import ScanModel from "../db/models/ScanModel.js"
import { spawn } from "child_process"
import { Types } from "mongoose"
import log from "./log.js"

const scan = async (target, options, user, res) => {
  const parsedOptions = options.map((x) => "-" + x.replace("=", " ")) // Transforms 'p=80' into '-p 80'
  let scanId = new Types.ObjectId()
  let responseSent = false
  const instance = await new ScanModel({
    _id: scanId,
    target,
    options, // Saves the original options ('p=80')
    user,
  }).save()
  const ls = spawn("nmap", [target, ...parsedOptions])

  const sendResponse = () => {
    if (!responseSent) {
      res.send({ result: instance })
      responseSent = true
    }
  }

  log.debug("$s started scanning $s.", [user.username, target])

  ls.stdout.on("data", async (data) => {
    await instance.updateOne({
      $push: {
        response: data.toString(),
      },
    })

    sendResponse()
  })

  ls.stderr.on("data", async (data) => {
    await instance.updateOne({
      $push: {
        error: data.toString(),
      },
    })
  })

  ls.on("close", async (code) => {
    await instance.updateOne({
      status: "done",
    })

    log.debug("$s finished scanning $s. Completed with code $s.", [
      user.username,
      target,
      code,
    ])

    sendResponse()
  })
}

export default scan
