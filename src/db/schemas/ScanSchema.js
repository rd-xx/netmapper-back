import EmbeddedUserSchema from "./EmbeddedUserSchema.js"
import { Schema } from "mongoose"

const ScanSchema = new Schema(
  {
    target: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    response: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "ongoing",
    },
    error: {
      type: [String],
    },
    user: {
      type: EmbeddedUserSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default ScanSchema
