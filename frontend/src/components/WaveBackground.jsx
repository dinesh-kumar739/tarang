const wavePath = "M0 100 C 120 40 240 40 360 100 S 600 160 720 100 S 960 40 1080 100 S 1320 160 1440 100";

const layers = [
  { top: "12%", speed: "animate-wave-slow", reverse: false, opacity: "opacity-30" },
  { top: "30%", speed: "animate-wave-mid", reverse: true, opacity: "opacity-40" },
  { top: "48%", speed: "animate-wave-fast", reverse: false, opacity: "opacity-50" },
  { top: "66%", speed: "animate-wave-mid", reverse: true, opacity: "opacity-40" },
  { top: "82%", speed: "animate-wave-slow", reverse: false, opacity: "opacity-30" },
];

const tones = {
  light: "text-primary",
  dark: "text-accent",
};

const WaveBackground = ({ variant = "light" }) => {
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${tones[variant]}`}>
      {layers.map((layer, index) => (
        <div
          key={index}
          className={`absolute left-0 w-[200%] flex ${layer.speed} ${layer.opacity} ${layer.reverse ? "[animation-direction:reverse]" : ""} motion-reduce:animate-none`}
          style={{ top: layer.top }}
        >
          {[0, 1].map((half) => (
            <svg key={half} viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-1/2 h-20 sm:h-24 shrink-0">
              <path d={wavePath} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d={wavePath} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" transform="translate(0 28)" opacity="0.6" />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WaveBackground;