import mongoose from "mongoose";


const featureCateSchema = new mongoose.Schema({

    featureCategoriesName : {
        type : String
    }

}, {timestamps : true})


const FeatureCategory = mongoose.model("Feature_Category", featureCateSchema)

export default FeatureCategory