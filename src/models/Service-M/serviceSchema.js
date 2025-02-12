import mongoose from "mongoose";


const serviceSchema = new mongoose.Schema({

    sub_categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feature_Sub_Category"
    },

    title: {
        type: String
    },

    authId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },

    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Feature_Category"
    },

    serviceImage: {
        type: Array
    },

    about_Gig: {
        type: String
    },

    requirement: {
        type: String
    }

}, { timestamps: true })


const Service = mongoose.model("Service", serviceSchema)

export default Service