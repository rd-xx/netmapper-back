import ScanSchema from "../schemas/ScanSchema.js"
import { model } from "mongoose"

const ScanModel = model("Scan", ScanSchema)

export default ScanModel
