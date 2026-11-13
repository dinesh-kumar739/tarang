import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        public_id: String,
        url: String,
    },
    about:{
        type:String,
        default:"Hey there! I am using Tarang.",
        maxlength:150,
        trim:true,
    },
    socialLinks:{
        github:{ type:String, default:"", trim:true },
        linkedin:{ type:String, default:"", trim:true },
        instagram:{ type:String, default:"", trim:true },
        website:{ type:String, default:"", trim:true },
    },
},{timestamps:true});

export const User = mongoose.model("User",userSchema);