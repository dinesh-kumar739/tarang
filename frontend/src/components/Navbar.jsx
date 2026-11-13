import { Info, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../store/slices/authSlice";
import AboutModal from "./AboutModal";

const Navbar = () => {
  const {authUser} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showAbout,setShowAbout] = useState(false);

  const handleLogout = async () => {
    dispatch(logOut());
  };
  return <>
  <header className="hidden sm:block fixed top-0 w-full bg-sidebar border-b border-sidebar-hover shadow-sm z-40">
    <div className="max-w-7xl mx-auto px-4 h-16">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-8">
          <Link to={"/"} className="flex items-center gap-2.5 hover:opacity-80 transition">
            <img src="/tarang.png" alt="Tarang" className="w-9 h-9 rounded-full object-cover bg-sidebar-hover ring-2 ring-sidebar-hover"/>
            <h1 className="text-xl font-bold text-white tracking-wide">Tarang</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={()=>setShowAbout(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:bg-sidebar-hover hover:text-white transition">
            <Info className="w-5 h-5"/>
            <span className="hidden md:inline">About</span>
          </button>
          {
            authUser && (
              <>
                <Link to={"/profile"} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:bg-sidebar-hover hover:text-white transition">
                  <User className="w-5 h-5"/>
                  <span className="hidden md:inline">Profile</span>
                </Link>
                <button onClick={handleLogout} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition">
                  <LogOut className="w-5 h-5"/>
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            )
          }
        </div>
      </div>
    </div>
  </header>
  <AboutModal open={showAbout} onClose={()=>setShowAbout(false)}/>
  </>;
};

export default Navbar;