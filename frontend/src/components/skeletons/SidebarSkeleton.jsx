const SidebarSkeleton = ({ width }) => {
  const skeletonContacts = Array(8).fill(null);
  const sidebarWidth = width ?? (typeof window !== "undefined" && window.innerWidth >= 1024 ? 288 : 80);
  const compact = sidebarWidth < 180;
  return <>
    <aside style={{"--sw":`${sidebarWidth}px`}} className="h-full w-full sm:w-[var(--sw)] sm:shrink-0 bg-canvas sm:bg-sidebar border-r border-line sm:border-sidebar-hover flex flex-col">
      <div className={`bg-sidebar border-b border-sidebar-hover w-full px-3 py-2 sm:p-4 animate-pulse ${compact ? "sm:hidden" : ""}`}>
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sidebar-hover"/>
            <div className="h-4 w-16 rounded bg-sidebar-hover"/>
          </div>
          <div className="w-9 h-9 rounded-full bg-sidebar-hover"/>
        </div>
        <div className="mt-1 sm:mt-0 h-9 rounded-full bg-sidebar-hover/70"/>
        <div className="hidden sm:block mt-3 h-4 w-20 rounded bg-sidebar-hover/70"/>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden py-2 px-2 space-y-1">
        {
          skeletonContacts.map((_,index)=>{
            return (
              <div key={index} className={`w-full p-2.5 flex items-center gap-3 animate-pulse ${compact ? "sm:justify-center sm:p-2" : ""}`}>
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-line sm:bg-sidebar-hover"/>
                <div className={`flex-1 min-w-0 flex flex-col gap-2 ${compact ? "sm:hidden" : ""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-4 w-28 max-w-full rounded bg-line sm:bg-sidebar-hover"/>
                    <div className="h-3 w-8 rounded bg-line/70 sm:bg-sidebar-hover/70"/>
                  </div>
                  <div className="h-3 w-40 max-w-full rounded bg-line/70 sm:bg-sidebar-hover/70"/>
                </div>
              </div>
            );
          })
        }
      </div>
    </aside>
  </>;
};

export default SidebarSkeleton;