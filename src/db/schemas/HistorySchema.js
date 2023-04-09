import EmbeddedUserSchema from "./EmbeddedUserSchema.js"
import { Schema } from "mongoose"

const HistorySchema = new Schema(
  {
    target: {
      type: String,
      required: true,
    },
    options: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    author: {
      type: EmbeddedUserSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default HistorySchema
