import { FaLinkedin } from "react-icons/fa";
import WaveBackground from "./WaveBackground";
import { developer } from "../data/developer";

const features = ["Real-time chat", "Photos and videos", "Online status"];

const AuthImagePattern = ({ title, subtitle }) => {
  const linkedinLabel = developer.links.linkedin.replace(/^https?:\/\/(www\.)?/, "");
  return <>
    <div className="relative overflow-hidden hidden lg:flex items-center justify-center p-12 bg-sidebar">
      <WaveBackground variant="dark"/>
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <span className="absolute inset-0 rounded-full border-2 border-accent/50 animate-ring-pulse motion-reduce:animate-none"/>
            <span className="absolute inset-0 rounded-full border-2 border-accent/50 animate-ring-pulse motion-reduce:animate-none" style={{animationDelay:"1.5s"}}/>
            <img src="/tarang.png" alt="Tarang" className="relative w-full h-full rounded-full object-cover bg-white border-4 border-sidebar-hover ring-2 ring-accent/40 shadow-lg"/>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="text-indigo-200 mt-2">{subtitle}</p>
        <p className="text-sm text-indigo-300 mt-4 leading-relaxed">
          Tarang is a real-time chat app where conversations flow like a wave. Message friends instantly, share moments and see who is online.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {
            features.map((feature)=>(
              <span key={feature} className="px-3 py-1 rounded-full bg-sidebar-hover/80 border border-white/10 text-xs text-indigo-100">
                {feature}
              </span>
            ))
          }
        </div>
        <div className="mt-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-4 text-left">
          <div className="flex items-center gap-3">
            <img src={developer.image} alt={developer.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/50 bg-white shrink-0"/>
            <div className="min-w-0">
              <p className="text-xs text-indigo-300">Developed by</p>
              <p className="font-semibold text-white truncate">{developer.name}</p>
              <p className="text-xs text-indigo-200 truncate">{developer.role}</p>
            </div>
          </div>
          {
            developer.links.linkedin && (
              <a href={developer.links.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-hover/80 hover:bg-primary transition text-sm text-white min-w-0">
                <FaLinkedin className="w-4 h-4 shrink-0"/>
                <span className="truncate">{linkedinLabel}</span>
              </a>
            )
          }
        </div>
      </div>
    </div>
  </>;
};

export default AuthImagePattern;