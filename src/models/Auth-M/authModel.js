// import mongoose from "mongoose";

// const authSchema = new mongoose.Schema({

//     firstName: {
//         type: String
//     },

//     lastName: {
//         type: String
//     },

//     email: {
//         type: String
//     },

//     password: {
//         type: String
//     },

//     confirm_password: {
//         type: String
//     },
// // for next step to register
//     country : {
//         type : String
//     },

//     mobile_number : {
//         type : Number
//     },

//     address : {
//         type : String
//     },

//     state : {
//         type : String
//     },

//     city : {
//         type : String
//     },

//     zip_code : {
//         type : Number
//     },

//     // for goto profile

//     tagline : {
//         type : String
//     },

//     description : {
//         type : String
//     },

//     college_university : {
//         type : String
//     },

//     title : {
//         type : String
//     },

//     year : {
//         type : Number
//     }

// }, { timestamps: true })


// const Auth = mongoose.model("Auth", authSchema)


// export default Auth






















import mongoose from "mongoose";

const authSchema = new mongoose.Schema({

    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    confirm_password: {
        type: String
    },

    country : {
        type : String
    },

    mobile_number : {
        type : Number
    },

    address : {
        type : String
    },

    state : {
        type : String
    },

    city : {
        type : String
    },

    zip_code : {
        type : Number
    },


    // for goto profile

    tagline : {
        type : String
    },

    description : {
        type : String
    },

    college_university : {
        type : String
    },

    title : {
        type : String
    },

    year : {
        type : Number
    }


}, { timestamps: true })


const Auth = mongoose.model("Auth", authSchema)


export default Auth