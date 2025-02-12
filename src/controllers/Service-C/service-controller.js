import Service from "../../models/Service-M/serviceSchema.js";


export const createService = async (req, res) => {

    try {
        const { sub_categoryId, title, authId, categoryId, about_Gig, requirement } = req.body

        const serviceImage = req.files.map(({ filename }) => `${filename}`)

        const checkService = await Service.findOne({ title })

        if (checkService) {
            return res.status(400).json({
                message: "already have this title of service"
            })
        }

        const newService = new Service({
            sub_categoryId, title, authId, categoryId, about_Gig, requirement, serviceImage
        })

        await newService.save()

        res.status(200).json({
            message: "created a new service"
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}


// single service

export const getSingleService = async (req, res) => {

    try {

        const { serviceId } = req.params

        const checkService = await Service.findById({ _id: serviceId }).populate({
            path: "sub_categoryId",
            select: "feature_SubCategories_name"
        })
            .populate({
                path: "authId",
                select: "firstName lastName"
            })
            .populate({
                path: "categoryId",
                select: "featureCategoriesName"
            })

        if (checkService) {
            res.status(200).json({
                message: "service are...",
                service: checkService
            })
        }

        else {
            res.status(404).json({
                message: "not found service"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}


// sub cate according service
export const perticular_sub_cat_service = async (req, res) => {

    try {
        const { sub_categoryId } = req.params

        const checkService = await Service.find({ sub_categoryId }).populate({
            path: "sub_categoryId",
            select: "feature_SubCategories_name"
        })
            .populate({
                path: "authId",
                select: "firstName lastName"
            })
            .populate({
                path: "categoryId",
                select: "featureCategoriesName"
            })

        if (checkService) {
            res.status(200).json({
                message: "perticular sub_categories_services",
                subCategories_Service: checkService
            })
        }

        else {
            res.status(404).json({
                message: "not found this sub-categories services"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}


// category according service

export const service_category_according = async (req, res) => {

    try {
        const { categoryId } = req.params

        const checkService = await Service.find({ categoryId })
            .populate({
                path: "sub_categoryId",
                select: "feature_SubCategories_name"
            })
            .populate({
                path: "authId",
                select: "firstName"
            }).populate({
                path: "categoryId",
                select: "featureCategoriesName"
            }).sort({ createdAt: -1 })

        let num_of_service = checkService.length

        if (checkService) {
            res.status(200).json({
                message: "service on category according",
                services: checkService,
                num_of_service
            })
        }

        else {
            res.status(404).json({
                message: "not found this category service"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}



// search service

export const search_service_by_title = async (req, res) => {


    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({
                message: "Please provide a title to search."
            });
        }

        const services = await Service.find({
            title: { $regex: title, $options: 'i' }

        }).select('-about_Gig -requirement -sub_categoryId -categoryId')
            .populate({
                path: "authId",
                select: "firstName lastName"
            })

        const total_of_service = services.length

        if (services.length > 0) {
            res.status(200).json({
                message: "Services found.",
                services,
                total_of_service
            });
        } else {
            res.status(404).json({
                message: "No services found with the given title."
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}



// perticular user according service


export const get_service_user_According = async (req, res) => {


    const { authId } = req.params

    const checkService = await Service.find({ authId }).populate({
        path: "authId",
        select: "firstName"
    }).select('-about_Gig -requirement -sub_categoryId -categoryId')
    .sort({ createdAt: 1 })


    if (checkService) {
        res.status(200).json({
            message: "service on user according",
            services: checkService,
        })
    }

    else {
        res.status(404).json({
            message: "not found this user service"
        })
    }

}