import Auth from "../../models/Auth-M/authModel.js";
import Temp from "../../models/Temp-M/tempSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const temp = async (req, res) => {
    
    try {
        const {firstName, lastName, email, password, confirm_password } = req.body;

        const checkAuth = await Temp.findOne({email})

        if(checkAuth) {
            return res.status(400).json({
                message : "already have account"
            })
        }

        if(password != confirm_password) {
            return res.status(401).json({
                message: "confirm_password are not matched"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const tempUser = new Temp({
            firstName, lastName, email, password : hash , confirm_password
        });
        
        await tempUser.save();

        res.status(200).json({
            message: "temporary registration"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};



export const register = async (req, res) => {
    
    try {
        const { firstName, country, mobile_number, address, state, city, zip_code } = req.body;
        
        const tempData = await Temp.findOne({ firstName });

        if (tempData) {

            const newAuth = new Auth({
                firstName,
                country,
                mobile_number,
                address,
                state,
                city,
                zip_code,
                ...tempData.toObject() 
            });

            await newAuth.save();

            await tempData.deleteOne({firstName});

            res.status(200).json({
                message: "Auth registered successfully"
            });
        } else {
            res.status(404).json({
                message: "please correct your firstName"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};





// login auth
export const login = async (req, res) => {

    try {

        const { email, password, firstName } = req.body

        const checkEmail = await Auth.findOne(email ? { email } : { firstName })

        if (!checkEmail) {
            return res.status(400).json({
                message: "details are not matched"
            })
        }

        const checkPassword = await bcrypt.compare(password, checkEmail.password)

        if (!checkPassword) {
            return res.status(400).json({
                message: "details are not matched"
            })
        }

        const token = await jwt.sign({ _id: checkEmail._id }, process.env.KEY, {
            expiresIn: "2h"
        })

        res.status(200).json({
            message: "auth login",
            authId: checkEmail._id,
            token
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}


// chnage password
export const changePassword = async (req, res) => {

    try {
        const { authId } = req.params

        const { oldPassword, newPassword, confirm_password } = req.body

        const checkUser = await Auth.findOne({ _id: authId })

        if (!checkUser) {
            return res.status(404).json({
                message: "auth not found"
            })
        }

        const checkPassword = await bcrypt.compare(oldPassword, checkUser.password)

        if (!checkPassword) {
            return res.status(400).json({
                message: "wrong Current Password"
            })
        }


        if (newPassword != confirm_password) {
            return res.status(401).json({
                message: "confirm_password are not matched"
            })
        }

        const hash = await bcrypt.hash(newPassword, 10)

        const chnage = await Auth.findOneAndUpdate({ _id: authId }, {

            $set: {
                password: hash
            }
        }, { new: true })

        res.status(200).json({
            message: "change password successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}



// update auth profile

export const updateAuth = async (req, res) => {

    try {
        const { authId } = req.params

        const { tagline, description, college_university, title, year } = req.body

        const checkUser = await Auth.findOne({ _id: authId })

        if (!checkUser) {
            return res.status(404).json({
                message: "auth details not found"
            })
        }

        const change = await Auth.findOneAndUpdate({ _id: authId }, {

            $set: {
                tagline, description, college_university, title, year
            }

        }, { new: true })

        res.status(200).json({
            message: "updated your profile"
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}


// get profile

export const getProfile = async (req, res) => {

    try {
        const { authId } = req.params

        const checkAuth = await Auth.findOne({ _id: authId })

        if (checkAuth) {
            res.status(200).json({
                message: "your profile",
                auth_profile: checkAuth
            })
        }

        else {
            res.status(404).json({
                message: "not found auth profile"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}
