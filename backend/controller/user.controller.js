import { catchAsyncError } from "../middlewares/catchasyncerror.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

const socialKeys = ["github", "linkedin", "instagram", "website"];

const normalizeLink = (value) => {
    const trimmed = String(value).trim();
    if(!trimmed) return "";
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try{
        const url = new URL(withProtocol);
        if(url.protocol !== "http:" && url.protocol !== "https:") return null;
        return url.href;
    } catch {
        return null;
    }
};

export const signup = catchAsyncError(async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide all required fields"
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Please provide a valid email address"
        });
    }
    if(password.length < 8){
        return res.status(400).json({
            success:false,
            message:"Password must be at least 8 characters long"
        });
    }
    const isEmailExist = await User.findOne({email});
    if(isEmailExist){
        return res.status(400).json({
            success:false,
            message:"Email already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        avatar:{
            public_id:"",
            url:""
        }
    });

    generateToken(user, "User registered successfully", 201, res);

});

export const signin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide all required fields"
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Please provide a valid email address"
        });
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Invalid email or password"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            success:false,
            message:"Invalid email or password"
        });
    }
    generateToken(user, "User logged in successfully", 200, res);
});

export const signout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" ? true : false,
    }).json({
        success: true,
        message: "User logged out successfully"
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
        success:true,
        user,
    });
});

export const uploadProfile = catchAsyncError(async (req, res, next) => {
    const fullName = req.body?.fullName?.trim();
    const email = req.body?.email?.trim();
    if(!fullName || !email){
        return res.status(400).json({
            success:false,
            message:"details cant be empty"
        });
    }

    const about = req.body?.about?.trim();
    if(about !== undefined && about.length > 150){
        return res.status(400).json({
            success:false,
            message:"About can be at most 150 characters"
        });
    }

    const socialLinks = {};
    for(const key of socialKeys){
        const raw = req.body?.[key];
        if(raw === undefined) continue;
        const link = normalizeLink(raw);
        if(link === null){
            return res.status(400).json({
                success:false,
                message:`Please provide a valid ${key} link`
            });
        }
        socialLinks[`socialLinks.${key}`] = link;
    }

    const avatar = req.files?.avatar;
    let cloudinaryResponse = {};
    if(avatar){
        try {
            const oldAvatarPublicId = req.user?.avatar?.public_id;
            if(oldAvatarPublicId && oldAvatarPublicId.length > 0){
                await cloudinary.uploader.destroy(oldAvatarPublicId);
            }
            cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
                folder: "tarang_avatars",
                transformation: [
                    { width: 300, height: 300, crop: "limit" },
                    { quality: "auto" },
                    {fetch_format: "auto"}
                ],
            });
        } catch (error) {
            console.error("Error uploading avatar to Cloudinary:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload avatar. Please try again later."
            });
        }
    }

    let data = {fullName, email, ...socialLinks};
    if(about !== undefined){
        data.about = about;
    }
    if(avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url){
        data.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user._id, data, {returnDocument: "after"}).select("-password");
    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        user,
    });
});