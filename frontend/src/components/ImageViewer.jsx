import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { setPreviewImage } from "../store/slices/chatSlice";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

const ImageViewer = () => {
  const { previewImage } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [previewImage?.url]);

  useEffect(() => {
    if (!previewImage) return;
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(setPreviewImage(null));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewImage, dispatch]);

  if (!previewImage) return null;

  const isVideo = /\.(mp4|webm|mov)/i.test(previewImage.url || "");
  const close = () => dispatch(setPreviewImage(null));
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  const toggleZoom = () => setZoom((z) => (z > 1 ? 1 : 2));

  return (
    <div role="dialog" aria-modal="true" aria-label="Media viewer" className="fixed inset-0 z-[60] flex flex-col bg-black/90">
      <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3 text-white" onClick={(e) => e.stopPropagation()}>
        <p className="font-medium truncate">{previewImage.name}</p>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {!isVideo && (
            <>
              <button onClick={zoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out" className="p-2 rounded-full hover:bg-white/15 transition disabled:opacity-40">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={zoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" className="p-2 rounded-full hover:bg-white/15 transition disabled:opacity-40">
                <ZoomIn className="w-5 h-5" />
              </button>
            </>
          )}
          <button onClick={close} aria-label="Close" className="p-2 rounded-full hover:bg-white/15 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 overflow-auto p-3 sm:p-6" onClick={close}>
        {isVideo ? (
          <video src={previewImage.url} controls autoPlay onClick={(e) => e.stopPropagation()} className="m-auto max-w-full max-h-full rounded-lg" />
        ) : (
          <img
            src={previewImage.url}
            alt={previewImage.name}
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            style={zoom > 1 ? { width: `${zoom * 100}%`, maxWidth: "none", maxHeight: "none", height: "auto" } : undefined}
            className={`m-auto rounded-lg ${zoom > 1 ? "cursor-zoom-out" : "max-w-full max-h-full object-contain cursor-zoom-in"}`}
          />
        )}
      </div>
    </div>
  );
};

export default ImageViewer;