import WaveBackground from "./WaveBackground";
import { developer } from "../data/developer";

const NoChatSelected = () => {
  return <>
  <div className="relative overflow-hidden w-full flex flex-1 flex-col items-center justify-center p-6 sm:p-10 lg:p-16 bg-canvas">
    <WaveBackground variant="light"/>
    <div className="relative z-10 max-w-md text-center space-y-4 sm:space-y-5">
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ring-pulse motion-reduce:animate-none"/>
          <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ring-pulse motion-reduce:animate-none" style={{animationDelay:"1.5s"}}/>
          <img src="/tarang.png" alt="Tarang" className="relative w-full h-full rounded-full object-cover bg-white border-4 border-white ring-2 ring-line shadow-lg"/>
        </div>
      </div>
      <h2 className="text-xl sm:text-3xl font-bold text-ink">
        Welcome to Tarang
      </h2>
      <p className="text-sm sm:text-base text-primary font-medium">Waves of Words, Bonds of Hearts</p>
      <p className="text-sm sm:text-base text-gray-500">Choose a contact from the sidebar to start chatting.</p>
    </div>
    <p className="absolute bottom-4 left-0 right-0 z-10 text-center text-xs sm:text-sm text-gray-500">
      Developed by <span className="font-medium text-ink">{developer.name}</span>
    </p>
  </div>
  </>;
};

export default NoChatSelected;