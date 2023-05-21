import ScanModel from "../db/models/ScanModel.js"

const FetchScanMiddleware = async (req, res, next) => {
  const scan = await ScanModel.findById(req.params.scanId)

  if (!scan) {
    res.status(404).send({ error: "Not found" })

    return
  }

  req.ctx.scan = scan
  next()
}

export default FetchScanMiddleware
