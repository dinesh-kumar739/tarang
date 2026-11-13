import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Image as ImageIcon, LogOut, Menu, Search, User, Video, X } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton"
import DeveloperModal from "./DeveloperModal";
import { getUsers, setSelectedUser, setPreviewImage } from "../store/slices/chatSlice";
import { logOut } from "../store/slices/authSlice";
import AboutModal from "./AboutModal";

const MIN_WIDTH = 80;
const MAX_WIDTH = 400;
const COMPACT_LIMIT = 180;

const getDefaultWidth = () => (typeof window !== "undefined" && window.innerWidth >= 1024 ? 288 : 80);

const getSavedWidth = () => {
  try {
    const saved = Number(localStorage.getItem("sidebarWidth"));
    if (saved >= MIN_WIDTH && saved <= MAX_WIDTH) return saved;
  } catch {
    return getDefaultWidth();
  }
  return getDefaultWidth();
};

const formatListTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const Sidebar = () => {
  const [showOnlineOnly,setShowOnlineOnly] = useState(false);
  const [search,setSearch] = useState("");
  const [menuOpen,setMenuOpen] = useState(false);
  const [showDeveloper,setShowDeveloper] = useState(false);
  const [width,setWidth] = useState(getSavedWidth);
  const asideRef = useRef(null);
  const {users,selectedUser,isUsersLoading} = useSelector(state=>state.chat);
  const {onlineUsers,authUser} = useSelector(state=>state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(getUsers());
  },[dispatch]);

  useEffect(()=>{
    try {
      localStorage.setItem("sidebarWidth", String(width));
    } catch {
      return;
    }
  },[width]);

  const startResize = (e)=>{
    e.preventDefault();
    const left = asideRef.current.getBoundingClientRect().left;
    const onMove = (ev)=>{
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, ev.clientX - left)));
    };
    const onUp = ()=>{
      window.removeEventListener("pointermove",onMove);
      window.removeEventListener("pointerup",onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove",onMove);
    window.addEventListener("pointerup",onUp);
  };

  const compact = width < COMPACT_LIMIT;
  const query = search.trim().toLowerCase();
  const onlineCount = (users || []).filter((user)=>onlineUsers.includes(user._id)).length;
  const filteredUsers = (users || []).filter((user)=>{
    if(showOnlineOnly && !onlineUsers.includes(user._id)) return false;
    if(query && !user.fullName.toLowerCase().includes(query)) return false;
    return true;
  });

  const renderPreview = (lastMessege)=>{
    if(!lastMessege) return <span className="truncate block">Tap to start chatting</span>;
    const mine = String(lastMessege.senderId) === String(authUser?._id);
    const isVideo = /\.(mp4|webm|mov)/i.test(lastMessege.media || "");
    return (
      <span className="flex items-center gap-1 min-w-0">
        {mine && <span className="shrink-0">You:</span>}
        {lastMessege.media && (isVideo ? <Video className="w-3.5 h-3.5 shrink-0"/> : <ImageIcon className="w-3.5 h-3.5 shrink-0"/>)}
        <span className="truncate">{lastMessege.text || (isVideo ? "Video" : "Photo")}</span>
      </span>
    );
  };

  const emptyText = query ? "No contacts match your search" : showOnlineOnly ? "No one is online right now" : "No contacts yet";

  if(isUsersLoading) return <SidebarSkeleton/>
  return <>
    <aside ref={asideRef} style={{"--sw":`${width}px`}} className={`relative h-full w-full sm:w-[var(--sw)] sm:shrink-0 bg-canvas sm:bg-sidebar border-r border-line sm:border-sidebar-hover flex-col ${selectedUser ? "hidden sm:flex" : "flex"}`}>
      <div className={`bg-sidebar border-b border-sidebar-hover w-full px-3 py-2 sm:p-4 ${compact ? "sm:hidden" : ""}`}>
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <img src="/tarang.png" alt="Tarang" className="w-7 h-7 rounded-full object-cover"/>
            <span className="text-white font-semibold text-lg tracking-wide">Tarang</span>
          </div>
          <button onClick={()=>setMenuOpen(true)} aria-label="Open menu" className="p-2 rounded-full text-indigo-100 hover:bg-sidebar-hover transition">
            <Menu className="w-5 h-5"/>
          </button>
        </div>
        <div className="relative mt-1 sm:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300"/>
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search contacts" className="w-full bg-sidebar-hover/70 text-white placeholder:text-indigo-300 text-sm rounded-full py-2 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"/>
          {search && (
            <button onClick={()=>setSearch("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white">
              <X className="w-4 h-4"/>
            </button>
          )}
        </div>
        <label className="hidden sm:flex mt-3 items-center gap-2 cursor-pointer text-sm text-indigo-200 w-fit">
          <input type="checkbox" checked={showOnlineOnly} onChange={(e)=>setShowOnlineOnly(e.target.checked)} className="w-4 h-4 rounded border-indigo-300 bg-sidebar-hover text-primary focus:ring-primary"/>
          <span>{onlineCount} online</span>
        </label>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-1">
        <label className="sm:hidden flex items-center gap-2 cursor-pointer text-sm text-gray-600 px-2 pb-1 w-fit">
          <input type="checkbox" checked={showOnlineOnly} onChange={(e)=>setShowOnlineOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"/>
          <span>{onlineCount} online</span>
        </label>
        {
          filteredUsers.map(user=>{
            const online = onlineUsers.includes(user._id);
            return (
              <div key={user._id} role="button" tabIndex={0} onClick={()=>dispatch(setSelectedUser(user))} onKeyDown={(e)=>{ if(e.key==="Enter") dispatch(setSelectedUser(user)); }} className={`w-full p-2.5 flex items-center gap-3 rounded-xl cursor-pointer transition-colors ${selectedUser?._id === user._id ? "bg-line sm:bg-sidebar-hover" : "hover:bg-white sm:hover:bg-sidebar-hover/60"} ${compact ? "sm:justify-center sm:p-2" : ""}`}>
                <div className="relative shrink-0">
                  <button type="button" onClick={(e)=>{ e.stopPropagation(); dispatch(setPreviewImage({url:user?.avatar?.url || "/avatar-holder.avif",name:user.fullName})); }} aria-label={`View ${user.fullName}'s photo`} className="block rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                    <img src={user?.avatar?.url || "/avatar-holder.avif"} alt={user.fullName} className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-full ring-2 ring-line sm:ring-sidebar-hover"/>
                  </button>
                  {online && (<span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full ring-2 ring-canvas sm:ring-sidebar"/>)}
                </div>
                <div className={`flex-1 min-w-0 text-left ${compact ? "sm:hidden" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate text-ink sm:text-white">{user.fullName}</span>
                    {user.lastMessege && <span className="text-[11px] shrink-0 text-gray-400 sm:text-indigo-300">{formatListTime(user.lastMessege.createdAt)}</span>}
                  </div>
                  <div className="text-sm text-gray-500 sm:text-indigo-300 min-w-0">{renderPreview(user.lastMessege)}</div>
                </div>
              </div>
            );
          })
        }
        {
          filteredUsers.length === 0 && ( <div className="text-center text-gray-500 sm:text-indigo-300 py-6 text-sm">{emptyText}</div> )
        }
      </div>
      <div onPointerDown={startResize} onDoubleClick={()=>setWidth(getDefaultWidth())} role="separator" aria-orientation="vertical" aria-label="Resize sidebar" style={{touchAction:"none"}} className="hidden sm:block absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-accent/60 active:bg-accent transition-colors z-10"/>
      {menuOpen && (
        <div className="sm:hidden absolute inset-0 z-20 bg-canvas flex flex-col">
          <div className="bg-sidebar px-3 py-2 flex items-center gap-2">
            <button onClick={()=>setMenuOpen(false)} aria-label="Back" className="p-2 rounded-full text-indigo-100 hover:bg-sidebar-hover transition">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <span className="text-white font-semibold text-lg">Menu</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-white border border-line rounded-2xl p-3">
              <img src={authUser?.avatar?.url || "/avatar-holder.avif"} alt={authUser?.fullName} className="w-12 h-12 rounded-full object-cover ring-2 ring-line"/>
              <div className="min-w-0">
                <div className="font-medium text-ink truncate">{authUser?.fullName}</div>
                <div className="text-sm text-gray-500 truncate">{authUser?.about}</div>
              </div>
            </div>
            <button onClick={()=>{ setMenuOpen(false); navigate("/profile"); }} className="w-full flex items-center gap-3 bg-white border border-line rounded-xl px-4 py-3 text-ink font-medium hover:bg-line/40 transition">
              <User className="w-5 h-5 text-primary"/>
              Profile
            </button>
            <button onClick={()=>dispatch(logOut())} className="w-full flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-3 font-medium transition">
              <LogOut className="w-5 h-5"/>
              Logout
            </button>
          </div>
          <button onClick={()=>setShowDeveloper(true)} className="mt-auto m-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary transition">
            <Code className="w-4 h-4"/>
            About Tarang
          </button>
        </div>
      )}
    </aside>
    <AboutModal open={showDeveloper} onClose={()=>setShowDeveloper(false)}/>
  </>;
};

export default Sidebar;