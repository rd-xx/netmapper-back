import { Schema } from "mongoose"

const EmbeddedUserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
)

export default EmbeddedUserSchema
