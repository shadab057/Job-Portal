import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res)=>{
    try {
        const {fullname, email, phoneNumber, password, role} = req.body;
if(!fullname || !email || !phoneNumber || !password || !role){
   
            return res.status(400).json({
              
       message:"Something is missing",
        success:false
        });
    };
    const user = await User.findOne({email});
    if (user) {
        return res.status(400).json({
            message:"User already exists with this email",
            success:false,
        }) 
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await User.create({
        fullname,
        email,
        phoneNumber,
        passpord:hashedPassword,
        role,
    });
    return res.status(201).json({
        message: "Account created sucessfully.",
        success:true,
    })
    } catch (error) {
        console.log(error);
        
    }
}

export const login = async (req,res)=>{
    try {
        const {email,passpord,role} = req.body;
        if (!email || !passpord || !role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,
            });
        };
        const isPasswordMatch = await bcrypt.compare(passpord, user.passpord);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,
            });
        };
        // check role is correct or not 
    if (role !== user.role) {
        return res.status(400).json({
            message:"Account doesn't exist with current role",
            success:false
        });
    };
    const tokenData ={
        userId:user._id
    }
    const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});
    user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile

    };

    return res.status(200).cookie("token",token,{maxAge:1*24*60*1000, httpsOnly:true, samesite:'strict'}).json({
        message: `Welcome back ${user.fullname}`,

    })
    } catch (error) {
    console.log(error)
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res)=>{
try {
    const {fullname, email,phoneNumber, bio, skills} =res.body;
    const file = req.file;
    if(!fullname || !email || !phoneNumber || !bio || !skills){
        return res.status(400).json({
   message:"Something is missing",
    success:false
    });
};

// cloudinary is coming there 


const skillsArray = skills.split(",");
const userId = req.id;  // middleware authentication
let user = await User.findById(userId);
if (user) {
    return res.status(400).json({
        message:"User not found.",
        success:false
    });
};

// updating data 
user.fullname = fullname,
user.email = email,
user.phoneNumber = phoneNumber,
user.profile.bio = bio,
user.profile.status = skillsArray

// resume comes later here....

await user.save();
user = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile
};

return res.status(200).json({
    message:"Profile updated successfully.",
    user,
success:true,
})
}
 catch (error) {
    console.log(error);
    
}
}
