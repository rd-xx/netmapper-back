import UserSchema from "../schemas/UserSchema.js"
import { model } from "mongoose"

const UserModel = model("User", UserSchema)

export default UserModel
