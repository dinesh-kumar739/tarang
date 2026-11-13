import { useEffect } from "react";
import { Code, Globe, Image as ImageIcon, Mail, MessageCircle, Search, ShieldCheck, Smartphone, User, Users, X } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import WaveBackground from "./WaveBackground";
import { about } from "../data/about";
import { developer } from "../data/developer";

const featureIcons = {
  message: MessageCircle,
  media: ImageIcon,
  online: Users,
  search: Search,
  profile: User,
  responsive: Smartphone,
  secure: ShieldCheck,
};

const linkItems = [
  { key: "github", label: "GitHub", Icon: FaGithub, href: (v) => v },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin, href: (v) => v },
  { key: "instagram", label: "Instagram", Icon: FaInstagram, href: (v) => v },
  { key: "website", label: "Website", Icon: Globe, href: (v) => v },
  { key: "email", label: "Email", Icon: Mail, href: (v) => `mailto:${v}` },
  { key: "repo", label: "Project source", Icon: Code, href: (v) => v },
];

const AboutModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const links = linkItems.filter(({ key }) => developer.links[key]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="About Tarang" className="w-full sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white border border-line shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative shrink-0 overflow-hidden bg-sidebar px-5 py-6 sm:py-8 text-center">
          <WaveBackground variant="dark" />
          <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 z-20 p-1.5 rounded-full text-indigo-100 hover:bg-sidebar-hover transition">
            <X className="w-5 h-5" />
          </button>
          <div className="relative z-10 flex flex-col items-center">
            <img src="/tarang.png" alt="Tarang" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-white border-4 border-sidebar-hover ring-2 ring-accent/40" />
            <h2 className="mt-3 text-2xl font-bold text-white">Tarang</h2>
            <p className="text-sm text-indigo-200">{about.tagline}</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-7">
          <section>
            <h3 className="text-base font-semibold text-ink">About Tarang</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{about.description}</p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-ink">What you can do</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {about.features.map(({ icon, title, text }) => {
                const Icon = featureIcons[icon] || MessageCircle;
                return (
                  <div key={title} className="flex gap-3 bg-canvas border border-line rounded-xl p-3.5">
                    <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-sidebar text-accent">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-ink text-sm">{title}</p>
                      <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-ink">Who can use Tarang</h3>
            <ul className="mt-3 space-y-2">
              {about.audience.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-ink">Built with</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {about.stack.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-canvas border border-line text-xs text-ink">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-ink">About the developer</h3>
            <div className="mt-3 bg-canvas border border-line rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <img src={developer.image} alt={developer.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-line bg-white shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-ink truncate">{developer.name}</p>
                  <p className="text-sm text-primary">{developer.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{developer.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {developer.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-0.5 rounded-full bg-white border border-line text-xs text-ink">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {links.map(({ key, label, Icon, href }) => (
                  <a key={key} href={href(developer.links[key])} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-line text-sm text-ink hover:bg-primary hover:text-white hover:border-primary transition min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;