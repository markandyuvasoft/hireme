import Auth from "../../models/Auth-M/authModel.js";
import Deposit from "../../models/Deposit-M/depositSchema.js";
import Draft from "../../models/Draft-M/draftSchema.js";
import Project from "../../models/Project-M/projectSchema.js";
import Service from "../../models/Service-M/serviceSchema.js";


// create project quote

export const createProject = async (req, res) => {

    try {

        const { authId } = req.params

        const { serviceId } = req.params

        const { order_quotes, dead_line, status } = req.body

        const checkService = await Service.findOne({ _id: serviceId })

        if (!checkService) {
            return res.status(404).json({
                message: "not found this service"
            })
        }

        const checkQuote = await Project.findOne({ order_quotes })

        if (checkQuote) {
            return res.status(400).json({
                message: "same as old quote"
            })
        }

        const newProject = new Project({
            order_quotes, serviceId, authId, dead_line, status
        })

        await newProject.save()

        res.status(200).json({
            message: "new project is created",
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}



// get the single service quote use serviceId

export const found_service_quote = async (req, res) => {

    try {
        const { serviceId } = req.params

        const checkService = await Project.findOne({ serviceId })
            .populate({
                path: "serviceId",
                select: "serviceImage title Basic_price.b_price authId"
            })
            .populate({
                path: "authId",
                select: "authProfile firstName lastName createdAt"
            })
            .populate({
                path: "messages.messagerId",
                select: "firstName lastName authProfile"
            })
            .populate({
                path: "uploadfiles.uploaderId",
                select: "firstName lastName authProfile"
            })

        if (checkService) {
            checkService.messages = checkService.messages.filter(msg => msg.message); 
            res.status(200).json({
                message: "this is your service quote",
                service_quote: checkService
            })
        }

        else {
            res.status(404).json({
                message: "not found this service quote"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}



// update messages and files on project quote

export const updateServiceQuote = async (req, res) => {

    try {
        const { projectId, authId } = req.params;
        const { message } = req.body;

        //isse old image null nhi hogi jab select nhi karoge jab
        const quoteFileNames = req.files && req.files.length > 0
            ? req.files.map(({ filename }) => filename)
            : [];


        const checkProject = await Project.findOne({ _id: projectId });
        if (!checkProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const updateData = {
            $push: { messages: { message, messagerId: authId } }
        };

        if (quoteFileNames.length > 0) {
            updateData.$push.uploadfiles = { quotefileName: quoteFileNames, uploaderId: authId };
        }

        const addOn = await Project.findOneAndUpdate(
            { _id: projectId },
            updateData,
            { new: true }
        );

        if (addOn) {
            res.status(200).json({
                message: "Updated quotes successfully"
            });

        } else {
            res.status(404).json({
                message: "Project quote update failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }

}



// delete quote message on message id and auth id

export const deleteQuoteMessages = async (req, res) => {

    try {
        const { authId, messageId } = req.params

        const checkUser = await Project.findOne({ authId })

        if (!checkUser) {
            return res.status(404).json({
                message: "not found auth profile"
            })
        }

        const updateProject = await Project.findOneAndUpdate(
            { authId },
            { $pull: { messages: { _id: messageId } } },
            { new: true }
        )

        if (updateProject) {
            res.status(200).json({
                message: "deleted this message"
            })
        }

        else {
            res.status(404).json({
                message: "not found this message"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// delete quote file on file id and auth id

export const deleteUplodedFiles = async (req, res) => {

    try {
        const { authId, uploadFileId } = req.params

        const checkUser = await Project.findOne({ authId })

        if (!checkUser) {
            return res.status(404).json({
                message: "not found authProfile"
            })
        }

        const updateProject = await Project.findOneAndUpdate(

            { authId },
            { $pull: { uploadfiles: { _id: uploadFileId } } },
            { new: true }
        )

        if (updateProject) {
            res.status(200).json({
                message: "deleted this file"
            })
        }

        else {
            res.status(404).json({
                message: "not found this file"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}



// all found projects 

export const found_allProjects = async (req, res) => {

    try {
        const { authId } = req.params

        const checkAuth = await Project.find({ authId })

        if (!checkAuth) {
            return res.status(404).json({
                message: "not found this auth profile"
            })
        }

        const allProjects = await Project.find({authId}).select("-messages -uploadfiles -authId")

            .populate({
                path: "serviceId",
                select: "title",
                //alg table se populate krne ke ley like service se meko authId chy tha
                populate: {
                    path: "authId",
                    select: "firstName"
                }
            })

        if (allProjects.length > 0) {
            res.status(200).json({
                message: "all found projects",
                allProjects: allProjects
            })
        }

        else {
            res.status(404).json({
                message: "not found any projects"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


// desplay on deshboard details

export const fetchDeshboardDetails = async (req, res) => {

    try {

        const { authId } = req.params

        const checkAuth = await Auth.findOne({ _id: authId })

        if (!checkAuth) {
            return res.status(404).json({
                message: "not found auth profile"
            })
        }

        const project_details = (await Project.find({authId})).length

        const check_draft_service = (await Draft.find({ authId })).length

        const check_public_service =  (await Service.find({ authId })).length

        const totalServices = check_draft_service + check_public_service; 

        const deposits = await Deposit.find({ authId });

        // Calculate total deposit amount
        const totalDepositAmount = deposits.reduce((total, deposit) => total + deposit.USDTotalAmount, 0);


        if (project_details.length > 0 || totalServices > 0) {

            res.status(200).json({
                message: "deshboard details",
                totalProjects: project_details,
                totalServices: totalServices,
                totalDepositAmount: totalDepositAmount,
            })
        }

        else {
            res.status(404).json({
                message: "not found details"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}