import express from "express"
import { changePassword, getProfile, login, register, temp, updateAuth } from "../../controllers/Auth-C/authController.js"


const authRouter = express.Router()

authRouter.post("/temp-register", temp)

authRouter.post("/registerAuth", register)

authRouter.post("/loginAuth", login)

authRouter.post("/change-password/:authId", changePassword)

authRouter.put("/update-profile-auth/:authId", updateAuth)

authRouter.get("/found-profile/:authId", getProfile)

export default authRouter