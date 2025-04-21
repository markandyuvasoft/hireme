import express from "express"
import { createMileStone, createStripeInvoiceForMilestone, deatils_On_Task_MileStone } from "../../controllers/MileStone-C/mileStoneController.js"

const mileStoneRouter = express.Router()

mileStoneRouter.post("/create-MileStone/:taskId/:bidId/:loginAuthId",createMileStone)

mileStoneRouter.get("/found-milestone-task/:taskId/:loginAuthId", deatils_On_Task_MileStone)

mileStoneRouter.get("/invoice/:milestoneId", createStripeInvoiceForMilestone)




export default mileStoneRouter