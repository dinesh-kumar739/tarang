import { useEffect } from "react";
import { Globe, X } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { developer } from "../data/developer";

const socialItems = [
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "website", label: "Website", Icon: Globe },
];

const DeveloperModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="About the developer" className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-line shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-sidebar h-20 sm:h-24 rounded-t-2xl" />
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 p-1.5 rounded-full text-indigo-100 hover:bg-sidebar-hover transition">
          <X className="w-5 h-5" />
        </button>
        <div className="px-5 pb-6 -mt-12 flex flex-col items-center text-center">
          <img src={developer.image} alt={developer.name} className="w-24 h-24 rounded-full object-cover border-4 border-white ring-2 ring-line bg-white" />
          <h2 className="mt-3 text-xl font-bold text-ink">{developer.name}</h2>
          <p className="text-sm text-primary font-medium">{developer.role}</p>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{developer.summary}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {developer.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-canvas border border-line text-xs text-ink">
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {socialItems.map(({ key, label, Icon }) =>
              developer.links[key] ? (
                <a key={key} href={developer.links[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 flex items-center justify-center rounded-full bg-canvas border border-line text-sidebar hover:bg-primary hover:text-white hover:border-primary transition">
                  <Icon className="w-5 h-5" />
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperModal;