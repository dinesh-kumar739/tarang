import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Globe, Mail, X } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { setPreviewImage, setProfileUser } from "../store/slices/chatSlice";

const socialItems = [
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "website", label: "Website", Icon: Globe },
];

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
};

const ContactProfileModal = () => {
  const { profileUser } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileUser) return;
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(setProfileUser(null));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileUser, dispatch]);

  if (!profileUser) return null;

  const online = onlineUsers.includes(profileUser._id);
  const avatarUrl = profileUser?.avatar?.url || "/avatar-holder.avif";
  const links = socialItems.filter(({ key }) => profileUser.socialLinks?.[key]);
  const close = () => dispatch(setProfileUser(null));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={close}>
      <div role="dialog" aria-modal="true" aria-label={`${profileUser.fullName}'s profile`} className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-line shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-sidebar h-20 sm:h-24 rounded-t-2xl" />
        <button onClick={close} aria-label="Close" className="absolute top-3 right-3 p-1.5 rounded-full text-indigo-100 hover:bg-sidebar-hover transition">
          <X className="w-5 h-5" />
        </button>
        <div className="px-5 pb-6 -mt-12 flex flex-col items-center text-center">
          <button onClick={() => dispatch(setPreviewImage({ url: avatarUrl, name: profileUser.fullName }))} aria-label="View photo" className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
            <img src={avatarUrl} alt={profileUser.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-white ring-2 ring-line bg-white" />
          </button>
          <h2 className="mt-3 text-xl font-bold text-ink">{profileUser.fullName}</h2>
          <p className={`mt-1 flex items-center gap-1.5 text-sm ${online ? "text-online" : "text-gray-500"}`}>
            <span className={`w-2 h-2 rounded-full ${online ? "bg-online" : "bg-gray-300"}`} />
            {online ? "Online" : "Offline"}
          </p>

          <div className="mt-5 w-full text-left bg-canvas border border-line rounded-xl p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">About</p>
            <p className="mt-1 text-sm text-ink break-words">{profileUser.about || "Hey there! I am using Tarang."}</p>
          </div>

          <div className="mt-3 w-full text-left bg-canvas border border-line rounded-xl divide-y divide-line">
            <div className="flex items-center gap-3 p-3 text-sm text-ink min-w-0">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <span className="truncate">{profileUser.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 text-sm text-ink">
              <CalendarDays className="w-4 h-4 text-accent shrink-0" />
              <span>Joined {formatDate(profileUser.createdAt)}</span>
            </div>
          </div>

          {links.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {links.map(({ key, label, Icon }) => (
                <a key={key} href={profileUser.socialLinks[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 flex items-center justify-center rounded-full bg-canvas border border-line text-sidebar hover:bg-primary hover:text-white hover:border-primary transition">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactProfileModal;