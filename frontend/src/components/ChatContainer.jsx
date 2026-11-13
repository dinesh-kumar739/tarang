import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Maximize2 } from "lucide-react";
import { getMesseges, pushNewMessege, setPreviewImage } from "../store/slices/chatSlice";
import { getSocket } from "../lib/socket";
import MessegeInput from "./MessageInput";
import MessegeSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {

  const {messeges,isMessegesLoading,selectedUser} = useSelector((state)=>state.chat);
  const {authUser} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const messegeEndRef = useRef(null);

  useEffect(()=>{
    dispatch(getMesseges(selectedUser._id));
  },[selectedUser._id]);

  useEffect(()=>{
    if(messegeEndRef.current && messeges){
      messegeEndRef.current.scrollIntoView({behavior:"smooth"});
    }
  },[messeges]);

  function formateMessegeTime(date){
    return new Date(date).toLocaleTimeString("en-US",{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    });
  }

  function openMedia(messege,isSender){
    dispatch(setPreviewImage({url:messege.media,name:isSender?"You":selectedUser?.fullName}));
  }

  useEffect(()=>{
    if(!selectedUser?._id) return;
    dispatch(getMesseges(selectedUser._id));

    const socket = getSocket();
    if(!socket) return;

    const handleNewMessege = (newMessege)=>{
      console.log("live message aaya:", newMessege);
      if(newMessege.senderId === selectedUser._id){
        dispatch(pushNewMessege(newMessege));
      }
    };
    socket.on("new-messege",handleNewMessege);
    return ()=>{
      socket.off("new-messege",handleNewMessege);
    };
  },[selectedUser?._id,dispatch]);

  if(isMessegesLoading){
    return (
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-auto bg-canvas">
        <ChatHeader/>
        <MessegeSkeleton/>
        <MessegeInput/>
      </div>
    )
  }

  return <>
    <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden bg-canvas">
      <ChatHeader/>
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-5">
        {
          messeges.length===0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <img src={selectedUser?.avatar?.url || "/avatar-holder.avif"} alt={selectedUser?.fullName} className="w-16 h-16 rounded-full object-cover ring-2 ring-line"/>
              <p className="mt-3 font-medium text-ink">No messages with {selectedUser?.fullName} yet</p>
              <p className="text-sm text-gray-500">Send a message to start the conversation.</p>
            </div>
          )
        }
        {
          messeges.length>0 && messeges.map((messege,index)=>{
            const isSender = messege.senderId === authUser._id;
            return (
              <div key={messege._id} className={`flex items-end ${isSender?"justify-end":"justify-start"}`} ref={index === messeges.length -1 ?messegeEndRef:null}>
                <div className={`hidden sm:block w-8 h-8 rounded-full overflow-hidden ring-2 ring-line shrink-0 ${isSender?"order-2 ml-3":"order-1 mr-3"}`}>
                  <img src={ isSender ? authUser?.avatar?.url || "/avatar-holder.avif" : selectedUser?.avatar?.url || "/avatar-holder.avif"} alt={isSender ? authUser?.fullName : selectedUser?.fullName} className="w-full h-full object-cover" />
                </div>
                <div className={`max-w-[80%] sm:max-w-sm md:max-w-md ${messege.media?"w-56 sm:w-72":""} px-3.5 sm:px-4 py-2 rounded-2xl text-sm break-words text-ink ${isSender?"bg-indigo-100/70 border border-indigo-200 rounded-br-md order-1":"bg-white border border-line rounded-bl-md order-2"}`}>
                  {
                    messege.media && (
                      <>
                        {
                          messege.media.includes(".mp4") ||
                          messege.media.includes(".webm") ||
                          messege.media.includes(".mov")  ?(
                            <div className="relative mb-2">
                              <video src={messege.media} controls className="w-full max-h-72 rounded-lg"/>
                              <button type="button" onClick={()=>openMedia(messege,isSender)} aria-label="View video in full screen" className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition">
                                <Maximize2 className="w-4 h-4"/>
                              </button>
                            </div>
                          ):(
                            <button type="button" onClick={()=>openMedia(messege,isSender)} aria-label="View photo in full screen" className="block w-full mb-2 rounded-lg overflow-hidden cursor-zoom-in">
                              <img src={messege.media} alt={`Photo from ${isSender?"you":selectedUser?.fullName}`} className="w-full max-h-72 object-cover" />
                            </button>
                          )
                        }
                      </>
                    )
                  }
                  {messege.text && <p className="whitespace-pre-wrap">{messege.text}</p>}
                  <span className="block text-[10px] mt-1 text-right text-gray-400">
                    {formateMessegeTime(messege.createdAt)}
                  </span>
                </div>
              </div>
            )
          })
        }
      </div>
      <MessegeInput/>
    </div>
  </>;
};

export default ChatContainer;