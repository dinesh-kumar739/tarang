import { ImagePlus, SendHorizontal, X} from "lucide-react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../lib/socket";
import { sendMessege } from "../store/slices/chatSlice";

const MessageInput = () => {
  const [text,setText] = useState("");
  const [mediaPreview,setMediaPreview] = useState(null);
  const [media,setMedia] = useState(null);
  const [mediaType,setMediaType] = useState("");
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const {selectedUser} = useSelector((state)=>state.chat);

  const handleMediaChange = (e)=>{
    const file = e.target.files[0];
    if(!file) return;

    setMedia(file);
    const type= file.type;
    if(type.startsWith("image/")){
      setMediaType("image");
      const reader = new FileReader();
      reader.onload=()=>{
        setMediaPreview(reader.result);
      }
      reader.readAsDataURL(file);
    }
    else if(type.startsWith("video/")){
      setMediaType("video");
      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);  
    }
    else{
      toast.error("please select an image or video");
      setMedia(null);
      setMediaPreview(null);
      setMediaType("");
      return;
    }
  };

  const removeMedia = ()=>{
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSentMessege = async (e)=>{
    e.preventDefault();

    if(!text.trim() && !media) return;
    const data = new FormData();
    data.append("text",text.trim());
    data.append("media",media);

    dispatch(sendMessege(data));

    setText("");
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleKeyDown = (e)=>{
    if(e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing){
      handleSentMessege(e);
    }
  };

  useEffect(()=>{
    const el = textareaRef.current;
    if(!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight,120)}px`;
  },[text]);

  useEffect(()=>{
    const socket = getSocket();
    if(!socket) return;
    const handleNewMessege = (newMessege)=>{
      if(newMessege.senderId === selectedUser._id || newMessege.receiverId === selectedUser._id) dispatch({type:"chat/pushNewMessege",payload:newMessege});
    };
    socket.on("newMessege",handleNewMessege);
    return ()=>socket.off("newMessege",handleNewMessege);
  },[selectedUser._id]);

  return <>
    <div className="p-3 sm:p-4 w-full bg-white border-t border-line">
      {mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            { mediaType=== "image"?(
              <img src={mediaPreview} alt="preview" className="w-20 h-20 object-cover rounded-xl border border-line" />
            ):(
              <video src={mediaPreview} controls className="w-32 h-20 object-cover rounded-xl border border-line"/>
            )}
            <button onClick={removeMedia} type="button" aria-label="Remove attachment" className="absolute -top-2 -right-2 w-6 h-6 bg-sidebar text-white rounded-full flex items-center justify-center hover:bg-sidebar-hover transition">
              <X className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSentMessege} className="flex items-end gap-2">
        <div className="flex-1 flex items-end gap-2 min-w-0">
          <textarea ref={textareaRef} rows={1} placeholder="Type a message" className="w-full min-w-0 resize-none px-4 py-2 sm:py-2.5 rounded-3xl border border-line bg-canvas text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base leading-6 sm:text-sm sm:leading-5" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={handleKeyDown}/>
          <input type="file" accept="image/*,video/*" ref={fileInputRef} className="hidden" onChange={handleMediaChange}/>
          <button type="button" aria-label="Attach photo or video" onClick={()=>fileInputRef.current?.click()} className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-full border border-line hover:bg-canvas transition ${mediaPreview?"text-online":"text-accent"}`}><ImagePlus size={20}/></button>
        </div>
        <button type="submit" aria-label="Send message" className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!text.trim() && !media}><SendHorizontal size={20}/></button>
      </form>
    </div>
  </>;
};

export default MessageInput;