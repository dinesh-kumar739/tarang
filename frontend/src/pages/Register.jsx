import {Eye,EyeOff,Loader2,Lock,Mail,User,UserPlus} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import DeveloperModal from "../components/DeveloperModal";
import { developer } from "../data/developer";
import { signup } from "../store/slices/authSlice";

const Register = () => {
  const [showPassword,setShowPassword] = useState(false);
  const [showDeveloper,setShowDeveloper] = useState(false);
  const [formData,setFormData] = useState({
    fullName:"",
    email:"",
    password:""
  });

const dispatch = useDispatch();
const {isSigningUp} = useSelector(state=>state.auth);

const handleSubmit = (e)=>{
  e.preventDefault();
  dispatch(signup(formData));
}

  return <>
    <div className="min-h-dvh pt-0 sm:pt-16 grid grid-cols-1 lg:grid-cols-2 bg-canvas">
      <AuthImagePattern title={"Join Tarang today"} subtitle={"Create an account and start chatting in seconds"}/>
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-line shadow-sm p-5 sm:p-8">
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
            <img src="/tarang.png" alt="Tarang" className="w-16 h-16 rounded-full object-cover bg-sidebar ring-4 ring-line"/>
            <h1 className="text-xl sm:text-2xl font-bold mt-4 text-ink">Create your account</h1>
            <p className="text-gray-500 text-sm mt-2">It only takes a minute to get started</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-ink mb-1">Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">
                  <User className="w-5 h-5"/>
                </span>
                <input id="register-name" type="text" autoComplete="name" className="w-full border border-line bg-canvas text-ink placeholder:text-gray-400 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Your full name" value={formData.fullName} onChange={(e)=>{setFormData({...formData,fullName:e.target.value})}}/>
              </div>
            </div>
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-ink mb-1">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">
                  <Mail className="w-5 h-5"/>
                </span>
                <input id="register-email" type="email" autoComplete="email" className="w-full border border-line bg-canvas text-ink placeholder:text-gray-400 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="you@example.com" value={formData.email} onChange={(e)=>{setFormData({...formData,email:e.target.value})}}/>
              </div>
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-ink mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">
                  <Lock className="w-5 h-5"/>
                </span>
                <input id="register-password" type={showPassword?"text":"password"} autoComplete="new-password" className="w-full border border-line bg-canvas text-ink placeholder:text-gray-400 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Create a password" value={formData.password} onChange={(e)=>{setFormData({...formData,password:e.target.value})}}/>
                <button type="button" aria-label={showPassword?"Hide password":"Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition" onClick={()=>setShowPassword(!showPassword)}>
                  {
                    showPassword ? (<EyeOff className="w-5 h-5"/>):(<Eye className="w-5 h-5"/>)
                  }
                </button>
              </div>
              <p className={`mt-1.5 text-xs ${formData.password.length>0 && formData.password.length<8 ? "text-red-500" : "text-gray-500"}`}>Use at least 8 characters</p>
            </div>
            <button type="submit" disabled={isSigningUp} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition duration-200 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {
                isSigningUp?(
                  <>
                    <Loader2 className="w-5 h-5 animate-spin"/> Creating account...
                  </>
                ):(
                  <>
                    <UserPlus className="w-5 h-5"/> Create account
                  </>
                )
              }
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Already on Tarang? {" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
        <button type="button" onClick={()=>setShowDeveloper(true)} className="lg:hidden mt-6 text-xs text-gray-500 hover:text-primary transition">
          Developed by <span className="font-medium text-ink">{developer.name}</span>
        </button>
      </div>
    </div>
    <DeveloperModal open={showDeveloper} onClose={()=>setShowDeveloper(false)}/>
  </>;
};

export default Register;