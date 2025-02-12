import express from "express"
import { createFeatureCategories, getAllFeaturedCategories } from "../../controllers/feature-categories-C/feature-categories-controller.js"


const featuredCategoriesRouter = express.Router()


featuredCategoriesRouter.post("/create-feature-categories", createFeatureCategories)

featuredCategoriesRouter.get("/all-featured-categories", getAllFeaturedCategories)


export default featuredCategoriesRouter