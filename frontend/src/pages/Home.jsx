import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import NoChatSelected from "../components/NoChatSelected"
import ChatContainer from "../components/ChatContainer"
import ImageViewer from "../components/ImageViewer";

const Home = () => {
  const {selectedUser} = useSelector((state)=>state.chat);
  return <>
    <div className="h-dvh pt-0 sm:pt-16 bg-canvas overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar/>
        {!selectedUser?<div className="hidden sm:flex flex-1 min-w-0"><NoChatSelected/></div>:<ChatContainer/>}
      </div>
    </div>
    <ImageViewer/>
  </>;
};

export default Home;