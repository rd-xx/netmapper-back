import { model } from "mongoose"
import HistorySchema from "../schemas/HistorySchema.js"

const HistoryModel = model("History", HistorySchema)

export default HistoryModel
