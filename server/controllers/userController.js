import cloudinary from "../lib/cloudinary.js";
import { generatetoken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


// signup new user
export const signup = async (req, res)=>{
    const {fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {

            return res.json({success: false, message: "Missing details"})  
        } 
        const user = await User.findOne({email})
        if(user){
            return res.json({success: false, message: "Account alredy exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        // save new user
        const newUser = await User.create({
            fullName, email, password: hashpassword, bio
        })

        const token = generatetoken(newUser._id);

        res.json({success: true, user: newUser, token, message: "Account created successfully"})
        
    } catch (error) {

        console.log(error);
        res.json({success: false, message: error})       
    }
}

// Login user
export const login = async (req, res) => {

    try {
        const {email, password} = req.body;
        const userdata = await User.findOne({email});

        if(!userdata){
            return res.json({success: false, message: "Invalid Credentials"});
        }

        const ispasswordCorrect = await bcrypt.compare(password, userdata.password)
       
        if(!ispasswordCorrect){
            return res.json({success: false, message: "Invalid Credentials"});
        }
        const token = generatetoken(userdata._id);
        res.json({success: true, user: userdata, token, message: "login successfully"})

    } catch (error) {

        console.log(error);
        res.json({success: false, message: error})     
    }
}

// controller to check is user is authenticated
export const checkAuth = ( req,res )=>{
    res.json({success: true, user: req.user})

}

// controller to update user profile details
export const  updateProfile = async (req, res) =>{
    try {
        const {profilepic, bio, fullName} = req.body;
        const userId = req.user._id
        let updatedUser;

        if (!profilepic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true});
        } else {
            const upload = await cloudinary.uploader.upload(profilepic)
            updatedUser = await User.findByIdAndUpdate(userId, {profilepic: upload.secure_url, bio, fullName}, {new: true})  
        }
        res.json({success: true, user: updatedUser})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})

        
        
    }

}
