import ScanModel from "../db/models/ScanModel.js"

const FetchScanMiddleware = async (req, res, next) => {
  if (!req.params.scanId) {
    res.status(400).send({ error: "Missing scanId" })

    return
  }

  try {
    const scan = await ScanModel.findById(req.params.scanId)

    if (!scan) {
      res.status(404).send({ error: "Not found" })

      return
    }

    req.ctx.scan = scan
    next()
  } catch (error) {
    console.log(error)
    res.status(404).send({ error: "Not found" })
  }
}

export default FetchScanMiddleware
