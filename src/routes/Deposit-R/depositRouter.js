import express from "express"
import { addDeposit, manageStatus } from "../../controllers/Deposit-C/depositController.js"


const depositRouter = express.Router()


depositRouter.post("/add-deposit/:authId", addDeposit)

depositRouter.get("/manageStatus/:session_id", manageStatus)

export default depositRouter