import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const sortUsers = (users)=>{
    users.sort((a,b)=>{
        const aTime = a.lastMessege ? new Date(a.lastMessege.createdAt).getTime() : 0;
        const bTime = b.lastMessege ? new Date(b.lastMessege.createdAt).getTime() : 0;
        if(aTime !== bTime) return bTime - aTime;
        return a.fullName.localeCompare(b.fullName);
    });
};

const applyLastMessege = (state,userId,messege)=>{
    const user = state.users.find((u)=>String(u._id) === String(userId));
    if(!user) return;
    user.lastMessege = {
        _id: messege._id,
        senderId: messege.senderId,
        text: messege.text || "",
        media: messege.media || "",
        createdAt: messege.createdAt,
    };
    sortUsers(state.users);
};

export const getUsers = createAsyncThunk("chat/getusers",async(_,thunkAPI)=>{
    try {
        const res = await axiosInstance.get("/messege/users");
        return res.data.users;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to load contacts";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

export const sendMessege = createAsyncThunk("chat/sendMessege",async(messegeData,thunkAPI)=>{
    try {
        const {chat} = thunkAPI.getState();
        const res = await axiosInstance.post(`/messege/send/${chat.selectedUser._id}`,messegeData);
        return res.data.messege;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to send message";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const getMesseges = createAsyncThunk("chat/getMesseges",async(userId,thunkAPI)=>{
    try {
        const res = await axiosInstance.get(`/messege/${userId}`);
        return res.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to load messages";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        messeges:[],
        users:[],
        selectedUser:null,
        isUsersLoading:false,
        isMessegesLoading:false,
        previewImage:null,
        profileUser:null,
    },
    reducers:{
        setSelectedUser: (state,action)=>{
            state.selectedUser = action.payload;
        },
        pushNewMessege: (state,action)=>{
            const exists = state.messeges.some((m)=>m._id === action.payload._id);
            if(!exists){
                state.messeges.push(action.payload);
            }
        },
        updateUserLastMessege: (state,action)=>{
            applyLastMessege(state,action.payload.userId,action.payload.messege);
        },
        setPreviewImage: (state,action)=>{
            state.previewImage = action.payload;
        },
        setProfileUser: (state,action)=>{
            state.profileUser = action.payload;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getUsers.pending,(state)=>{
            state.isUsersLoading = true;
        })
        .addCase(getUsers.fulfilled,(state,action)=>{
            state.users = action.payload;
            state.isUsersLoading = false;
        })
        .addCase(getUsers.rejected,(state)=>{
            state.isUsersLoading = false;
        })
        .addCase(getMesseges.pending,(state)=>{
            state.isMessegesLoading = true;
        })
        .addCase(getMesseges.fulfilled,(state,action)=>{
            state.messeges = action.payload.messeges;
            state.isMessegesLoading = false;
        })
        .addCase(getMesseges.rejected,(state)=>{
            state.isMessegesLoading = false;
        })
        .addCase(sendMessege.fulfilled,(state,action)=>{
            const exists = state.messeges.some((m)=>m._id === action.payload._id);
            if(!exists){
                state.messeges.push(action.payload);
            }
            applyLastMessege(state,action.payload.receiverId,action.payload);
        })
    }
});

export const {setSelectedUser,pushNewMessege,updateUserLastMessege,setPreviewImage,setProfileUser} = chatSlice.actions;

export default chatSlice.reducer;