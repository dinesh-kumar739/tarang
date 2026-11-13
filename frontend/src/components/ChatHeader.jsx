import { ArrowLeft, Info, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setProfileUser } from "../store/slices/chatSlice";
import ContactProfileModal from "./ContactProfileModal";

const ChatHeader = () => {

  const {selectedUser} = useSelector((state)=>state.chat);
  const {onlineUsers} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const openProfile = ()=>dispatch(setProfileUser(selectedUser));
  return <>
    <div className="px-3 py-2.5 sm:p-3 border-b border-line bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
          <button onClick={()=>dispatch(setSelectedUser(null))} aria-label="Back to contacts" className="sm:hidden p-1.5 -ml-1 rounded-full text-primary hover:bg-canvas transition shrink-0">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          <div role="button" tabIndex={0} onClick={openProfile} onKeyDown={(e)=>{ if(e.key==="Enter") openProfile(); }} aria-label={`View ${selectedUser?.fullName}'s profile`} className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 cursor-pointer rounded-lg p-1 -m-1 hover:bg-canvas/70 transition">
            <div className="relative w-10 h-10 shrink-0">
              <img src={selectedUser?.avatar?.url || "/avatar-holder.avif"} alt={selectedUser?.fullName} className="w-full h-full object-cover rounded-full ring-2 ring-line"/>
              {onlineUsers.includes(selectedUser._id) && ( <span className="absolute bottom-0 right-0 w-3 h-3 bg-online border-white border-2 rounded-full"/>)}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-base text-ink truncate">
                {selectedUser?.fullName}
              </h3>
              <p className={`text-sm ${onlineUsers.includes(selectedUser?._id) ? "text-online" : "text-gray-500"}`}>{onlineUsers.includes(selectedUser?._id)?"Online":"Offline"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={openProfile} aria-label="Contact info" className="p-1.5 rounded-full text-gray-500 hover:text-primary hover:bg-canvas transition">
            <Info className="w-5 h-5"/>
          </button>
          <button onClick={()=>dispatch(setSelectedUser(null))} aria-label="Close chat" className="hidden sm:block p-1.5 rounded-full text-gray-500 hover:text-ink hover:bg-canvas transition">
            <X className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
    <ContactProfileModal/>
  </>;
};

export default ChatHeader;