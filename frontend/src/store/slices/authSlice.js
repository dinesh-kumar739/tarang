import {createSlice} from "@reduxjs/toolkit"
import {axiosInstance} from "../../lib/axios"
import {createAsyncThunk} from "@reduxjs/toolkit"
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";
import { updateUserLastMessege } from "./chatSlice";

const startSocket = (userId, dispatch) => {
    const socket = connectSocket(userId);
    socket.off("getOnlineUsers");
    socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
    });
    socket.on("new-messege", (messege) => {
        dispatch(updateUserLastMessege({ userId: messege.senderId, messege }));
    });
};

export const getUser = createAsyncThunk("user/me",async(_,thunkAPI)=>{
    try{
        const response = await axiosInstance.get("/user/me");
        startSocket(response.data.user._id, thunkAPI.dispatch);
        return response.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || {message: "Failed to fetch user"});
    }
});

export const updateProfile = createAsyncThunk("user/update-profile",async(data,thunkAPI)=>{
    try {
        const res = await axiosInstance.put("/user/upload-profile",data);
        toast.success("Profile updated successfully.");
        return res.data.user;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to update profile";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const signup =createAsyncThunk("auth/sign-up",async(data,thunkAPI)=>{
    try {
        await axiosInstance.post("/user/sign-up",data);
        const res = await axiosInstance.get("/user/me");
        startSocket(res.data.user._id, thunkAPI.dispatch);
        toast.success("Account created successfully.");
        return res.data.user;
    } catch (error) {
        const message = error.response?.data?.message || "Signup failed";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const logOut = createAsyncThunk("user/sign-out",async(_,thunkAPI)=>{
    try {
        await axiosInstance.get("/user/sign-out");
        disconnectSocket();
        return null;
    } catch (error) {
        const message = error.response?.data?.message || "Logout failed";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const login = createAsyncThunk("user/sign-in",async(data,thunkAPI)=>{
    try {
        await axiosInstance.post("/user/sign-in",data);
        const res = await axiosInstance.get("/user/me");
        startSocket(res.data.user._id, thunkAPI.dispatch);
        toast.success("Logged in successfully.")
        return res.data.user;
    } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

const authSlice = createSlice({
    name:"auth",
    initialState:{ 
        authUser:null,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        isCheckingAuth: true,
        onlineUsers:[],
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(getUser.fulfilled,(state,action)=>{
            state.isCheckingAuth = false;
            state.authUser = action.payload;
        })
        .addCase(getUser.rejected,(state)=>{
            state.isCheckingAuth = false;
            state.authUser = null;
        })
        .addCase(logOut.fulfilled,(state)=>{
            state.authUser=null;
            state.onlineUsers=[];
        })
        .addCase(login.pending,(state)=>{
            state.isLoggingIn = true;
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.authUser = action.payload;
            state.isLoggingIn = false;
        })
        .addCase(login.rejected,(state)=>{
            state.isLoggingIn = false;
        })
        .addCase(signup.pending,(state)=>{
            state.isSigningUp = true;
        })
        .addCase(signup.fulfilled,(state,action)=>{
            state.authUser = action.payload;
            state.isSigningUp = false;
        })
        .addCase(signup.rejected,(state)=>{
            state.isSigningUp = false;
        })
        .addCase(updateProfile.pending,(state)=>{
            state.isUpdatingProfile = true;
        })
        .addCase(updateProfile.fulfilled,(state,action)=>{
            state.authUser = action.payload;
            state.isUpdatingProfile = false;
        })
        .addCase(updateProfile.rejected,(state)=>{
            state.isUpdatingProfile = false;
        })
    }
})

export const {setOnlineUsers} = authSlice.actions;
export default authSlice.reducer;