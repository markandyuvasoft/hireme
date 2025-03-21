import mongoose from "mongoose";

const depositSchema = new mongoose.Schema({

    authId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },

    depositAmountUSD: {
        type: Number
    },

    USDTotalAmount: {
        type: Number
    },

    IndianTotalAmout : {
        type : Number
    },

    process_charge: {
        type: Number
    },

    stripeSessionId: {
        type: String
    },

    status: {
        type: String,
        enum: ["pending", "success", "cancle"],
        default: "pending"
    }

}, { timestamps: true })


const Deposit = mongoose.model("Deposit", depositSchema)

export default Deposit