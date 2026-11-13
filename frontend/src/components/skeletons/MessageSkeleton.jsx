const MessageSkeleton = () => {
  const skeletonMesseges = Array(6).fill(null);
  const heights = ["h-12 sm:h-14","h-10","h-28 sm:h-32","h-12","h-14 sm:h-16","h-10"];
  return <>
    <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4 space-y-4 bg-canvas">
      {
        skeletonMesseges.map((_,index)=>{
          const mine = index%2!==0;
          return (
            <div key={index} className={`flex items-end gap-3 ${mine?"justify-end flex-row-reverse":"justify-start"}`}>
              <div className="hidden sm:block w-8 h-8 shrink-0 rounded-full bg-line animate-pulse"/>
              <div className="max-w-[80%] min-w-0">
                <div className={`w-44 sm:w-56 max-w-full ${heights[index]} rounded-2xl animate-pulse ${mine?"bg-indigo-100/70 border border-indigo-200 rounded-br-md":"bg-white border border-line rounded-bl-md"}`}/>
                <div className={`mt-1.5 h-2.5 w-10 rounded bg-line animate-pulse ${mine?"ml-auto":""}`}/>
              </div>
            </div>
          )
        })
      }
    </div>
  </>;
};

export default MessageSkeleton;