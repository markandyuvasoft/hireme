import FeatureCategory from "../../models/featureCategories-M/feature-categories-schema.js";


export const createFeatureCategories = async (req, res) => {

    try {
        const { featureCategoriesName } = req.body

        const checkfeatureCat = await FeatureCategory.findOne({ featureCategoriesName })

        if (checkfeatureCat) {
            return res.status(400).json({
                message: "already have feature-categories"
            })
        }

        const newCategories = new FeatureCategory({
            featureCategoriesName
        })

        await newCategories.save()

        res.status(200).json({
            message: "created a featured categories"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}



export const getAllFeaturedCategories = async (req, res) => {

    try {
        
        const checkfeatureCat = await FeatureCategory.find({})

        if (checkfeatureCat.length > 0) {
            res.status(200).json({
                message: "all featured categories",
                featuredCategories: checkfeatureCat
            })
        }

        else {
            res.status(404).json({
                message: "not found any featured categories"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}