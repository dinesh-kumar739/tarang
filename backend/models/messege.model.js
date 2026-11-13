import mongoose from "mongoose";

const messegeSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    text:String,
    media:String,
},{timestamps:true});

messegeSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messegeSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

export const Messege = mongoose.model("Messege",messegeSchema);