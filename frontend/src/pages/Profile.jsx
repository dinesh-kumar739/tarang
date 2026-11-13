import { ArrowLeft, Camera, Globe, Info, Loader2, Mail, User } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../store/slices/authSlice";

const socialFields = [
  { key: "github", label: "GitHub", Icon: FaGithub, placeholder: "github.com/username" },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin, placeholder: "linkedin.com/in/username" },
  { key: "instagram", label: "Instagram", Icon: FaInstagram, placeholder: "instagram.com/username" },
  { key: "website", label: "Website", Icon: Globe, placeholder: "yourwebsite.com" },
];

const Profile = () => {

  const {authUser,isUpdatingProfile} = useSelector((state)=>state.auth);
  const [selectImage,setSelectImage] = useState(null);
  const [formData,setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    avatar: authUser?.avatar?.url,
    about: authUser?.about || "",
    github: authUser?.socialLinks?.github || "",
    linkedin: authUser?.socialLinks?.linkedin || "",
    instagram: authUser?.socialLinks?.instagram || "",
    website: authUser?.socialLinks?.website || "",
  })

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageUpload = (e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = ()=>{
      const base64Image = reader.result;
      setSelectImage(base64Image);
      setFormData({...formData,avatar:file});
    };
  };

  const handleUpdateProfile = ()=>{
    const data = new FormData();
    data.append("fullName",formData.fullName);
    data.append("email",formData.email);
    data.append("about",formData.about);
    socialFields.forEach(({key})=>data.append(key,formData[key]));
    if(formData.avatar instanceof File) data.append("avatar",formData.avatar);
    dispatch(updateProfile(data));
  }

  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})
    : "";

  return <>
    <div className="min-h-screen pt-0 sm:pt-16 bg-canvas">
      <div className="sm:hidden sticky top-0 z-30 bg-sidebar px-3 py-2 flex items-center gap-2">
        <button onClick={()=>navigate("/")} aria-label="Back to chats" className="p-2 rounded-full text-indigo-100 hover:bg-sidebar-hover transition">
          <ArrowLeft className="w-5 h-5"/>
        </button>
        <span className="text-white font-semibold text-lg">Profile</span>
      </div>
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        <div className="bg-white rounded-2xl border border-line shadow-sm p-5 sm:p-8 space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="hidden sm:block text-2xl font-semibold text-ink">Your profile</h1>
            <p className="text-sm sm:text-base text-gray-500 sm:mt-2">Manage how others see you on Tarang</p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <img src={selectImage || formData.avatar || "/avatar-holder.avif"} alt={authUser?.fullName} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-top border-4 border-line"/>
              <label htmlFor="avatar-upload" aria-label="Change profile photo" className={`absolute bottom-0 right-0 bg-primary hover:bg-primary-dark hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile?"animate-pulse pointer-events-none":""}`}>
                <Camera className="w-5 h-5 text-white"/>
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile}/>
              </label>
            </div>
          </div>
          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4 text-accent"/> Name
              </div>
              <input type="text" value={formData.fullName} onChange={(e)=>setFormData({...formData,fullName:e.target.value})} className="px-4 py-2.5 bg-canvas rounded-lg border border-line text-ink w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent"/> Email
              </div>
              <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} className="px-4 py-2.5 bg-canvas rounded-lg border border-line text-ink w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-gray-500 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2"><Info className="w-4 h-4 text-accent"/> About</span>
                <span className="text-xs text-gray-400">{formData.about.length}/150</span>
              </div>
              <textarea rows={3} maxLength={150} value={formData.about} onChange={(e)=>setFormData({...formData,about:e.target.value})} placeholder="Write something about yourself" className="px-4 py-2.5 bg-canvas rounded-lg border border-line text-ink w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-base font-medium text-ink">Social links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {
                socialFields.map(({key,label,Icon,placeholder})=>(
                  <div key={key} className="relative">
                    <Icon aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent"/>
                    <input type="text" aria-label={label} value={formData[key]} onChange={(e)=>setFormData({...formData,[key]:e.target.value})} placeholder={placeholder} className="pl-9 pr-3 py-2.5 bg-canvas rounded-lg border border-line text-ink text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
                  </div>
                ))
              }
            </div>
          </div>
          <button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {
              isUpdatingProfile?( <>
                <Loader2 className="w-5 h-5 animate-spin"/> Saving...
              </>):("Save changes")
            }
          </button>
          <p className="text-center text-sm text-gray-500">Member since {memberSince}</p>
        </div>
      </div>
    </div>
  </>;
};

export default Profile;