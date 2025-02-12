import Blog from "../../models/Blog-M/latest-blog-schema.js";
import FeatureCategory from "../../models/featureCategories-M/feature-categories-schema.js";
import Service from "../../models/Service-M/serviceSchema.js";




export const Details_home_page = async (req, res) => {

    try {

        const checkBlog = await Blog.find({}).sort({sort : 1}).sort({ createdAt: -1 });

        const checkFeaturedCategories = await FeatureCategory.find({})

        const checkService = await Service.find({}).populate({
            path : "sub_categoryId",
            select : "feature_SubCategories_name"
        })
        .populate({
            path : "authId",
            select : "firstName lastName"
        })
        .populate({
            path : "categoryId",
            select : "featureCategoriesName"
        })

        if (checkBlog.length > 0 || checkFeaturedCategories.length > 0 || checkService.length > 0) {

            res.status(200).json({
                message: "Details on home page",
                feature_categories: checkFeaturedCategories,
                latestBlogs: checkBlog,
                popularService : checkService
            })

        }

        else {
            res.status(404).json({
                message: "not found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}


