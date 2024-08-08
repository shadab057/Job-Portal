import mongoose, { modelNames } from "mongoose";
import { User } from "./user.model";

const comapanySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    website:{
        type:String,
    },
    location:{
        type:String,
    },
    logo:{
        type:String,  //URL  to company logo 
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
},{timestamps:true})
export const Job = mongoose.model("Job",jobSchema);