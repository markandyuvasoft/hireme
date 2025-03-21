import mongoose from "mongoose";

const taskSubCategorySchema = new mongoose.Schema({

    authId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },

    taskCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "taskCategory"
    },

    taskTitle: {
        type: String
    },

    taskDescription: {
        type: String
    },

    task_logo: {
        type: String
    },

    taskVerify: {
        type: Boolean,
        default: true
    },

    task_Skill_Required: [{
        type: String
    }],

    tags: {
        type: String
    },

    taskType: {
        type: String,
        enum: ['Freelance', 'Full Time', 'Part Time', 'Internship', 'Temporary']
    },

    location: {
        type: String
    },

    ratings: [
        {
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            review: {
                type: String
            },
            reviewerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Auth"
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true })


const TaskSubcategory = mongoose.model("TaskSubcategory", taskSubCategorySchema)

export default TaskSubcategory