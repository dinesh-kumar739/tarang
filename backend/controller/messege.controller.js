import { catchAsyncError } from "../middlewares/catchasyncerror.js";
import { User } from "../models/user.model.js";
import { Messege } from "../models/messege.model.js";
import {v2 as cloudinary} from "cloudinary";
import {io , getReceiverSocketId } from "../utils/socket.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const myId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: myId } }).select("-password").lean();

    const lastMesseges = await Messege.aggregate([
        { $match: { $or: [{ senderId: myId }, { receiverId: myId }] } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: { $cond: [{ $eq: ["$senderId", myId] }, "$receiverId", "$senderId"] },
                lastMessege: { $first: "$$ROOT" },
            },
        },
    ]);

    const lastMessegeMap = new Map(
        lastMesseges.map((item) => [
            String(item._id),
            {
                _id: item.lastMessege._id,
                senderId: item.lastMessege.senderId,
                text: item.lastMessege.text || "",
                media: item.lastMessege.media || "",
                createdAt: item.lastMessege.createdAt,
            },
        ])
    );

    const users = filteredUsers.map((user) => ({
        ...user,
        lastMessege: lastMessegeMap.get(String(user._id)) || null,
    }));

    users.sort((a, b) => {
        const aTime = a.lastMessege ? new Date(a.lastMessege.createdAt).getTime() : 0;
        const bTime = b.lastMessege ? new Date(b.lastMessege.createdAt).getTime() : 0;
        if (aTime !== bTime) return bTime - aTime;
        return a.fullName.localeCompare(b.fullName);
    });

    res.status(200).json({
        success: true,
        users
    });
});

export const getMesseges = catchAsyncError(async (req, res, next) => {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const receiver = await User.findById(receiverId);
    if(!receiver){
        return res.status(404).json({
            success:false,
            message:"Receiver not found"
        });
    }
    const messeges = await Messege.find({
        $or: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    }).sort({ createdAt: 1 });
    res.status(200).json({
        success: true,
        messeges
    });
});

export const sendMessege = catchAsyncError(async (req, res, next) => {
    const {text} = req.body;
    const media = req.files?.media;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const receiver = await User.findById(receiverId);
    if(!receiver) {
        return res.status(404).json({
            success:false,
            message:"Receiver not found"
        });
    }
    const senetizedText = text?.trim() || "";
    if(!senetizedText && !media) {
        return res.status(400).json({
            success:false,
            message:"Please provide a text or media"
        });
    }
    let mediaUrl = "";
    if(media) {
        try{
            const uploadResponse = await cloudinary.uploader.upload(media.tempFilePath, {
                resource_type: "auto",
                folder: "tarang_media",
                transformation: [
                    { width: 1080, height: 1080, crop: "limit" },
                    {quality: "auto"},
                    {fetch_format: "auto"}
                ]
            });
            mediaUrl = uploadResponse?.secure_url;
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error uploading media"
            });
        }
    }
    const newMessege = await Messege.create({
        senderId,
        receiverId,
        text: senetizedText,
        media: mediaUrl
    });
    const receiverSocketId = [].concat(getReceiverSocketId(receiverId) || []);
    if(receiverSocketId.length > 0) {
        io.to(receiverSocketId).emit("new-messege", newMessege);
    }
    res.status(201).json({
        success: true,
        messege: newMessege
    });
});