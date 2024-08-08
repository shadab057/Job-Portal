import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    }, 
    phonenumber:{
        type:Number,
        unique:true
    },
    passpord:{
        type:String,
        require:true
    },
role:{
    type:String,
    enum:['student', 'recruiter'],
    require:true
},
profile:{
    bio:{type:String},
    skills:{type:String},
    resume:{type:String},   // URL to resume file
    resumeOriginalName:{type:String},
    company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'},
    profilePhoto:{
        type:String,
        default:" "
    } 

}
},{timestamps:true});
export const User = mongoose.model('User',userSchema);