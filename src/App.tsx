import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React from "react";

// Types
interface PanelProps {
  baseColor: string;
  clipPath: string;
  bgImage: string;
  charImage: string;
  mainBgText: string;
  nameJp: string;
  nameEn: string;
  themeColor: string;
  number: string;
  badges: { img: string; label: string; rot: number }[];
}

const Panel = ({
  baseColor,
  clipPath,
  bgImage,
  charImage,
  mainBgText,
  nameJp,
  nameEn,
  themeColor,
  number,
  badges,
}: PanelProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 40, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [-1, 1], [-15, 15]);

  const charX = useTransform(smoothX, [-1, 1], [-35, 35]);
  const charY = useTransform(smoothY, [-1, 1], [-35, 35]);
  const charScale = useTransform(smoothY, [-1, 1], [0.98, 1.05]);

  const textX = useTransform(smoothX, [-1, 1], [25, -25]);
  const textY = useTransform(smoothY, [-1, 1], [25, -25]);

  const floatingBadgesX = useTransform(smoothX, [-1, 1], [35, -35]);
  const floatingBadgesY = useTransform(smoothY, [-1, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = ((clientY - top) / height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      className="relative w-full h-[100svh] overflow-hidden flex items-center justify-center font-sans tracking-wide"
      style={{ backgroundColor: baseColor }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Layer 1 & 2: Environment with Geometric Mask */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          className="w-[110%] h-[110%] origin-center retro-filter"
          style={{
            clipPath: clipPath,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            x: bgX,
            y: bgY,
            filter: "saturate(0.7) contrast(1.1) sepia(0.1) blur(2px)", // slight blur to environment
          }}
        >
          {/* Overlay grid pattern to environment */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+Cjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
        </motion.div>
      </motion.div>

      {/* Layer 4 Base: Text behind character */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
        style={{ x: textX, y: textY }}
      >
        <h1 className="font-black text-[22vw] leading-none text-white/5 whitespace-nowrap -rotate-2 select-none tracking-tighter">
          {mainBgText}
        </h1>
      </motion.div>

      {/* Layer 3: Character */}
      <motion.div
        className="absolute inset-x-0 bottom-0 top-[10%] z-30 pointer-events-none flex items-end justify-center"
        style={{ x: charX, y: charY, scale: charScale }}
      >
        <img
          src={charImage}
          alt={nameEn}
          className="h-full max-w-none object-contain retro-filter mix-blend-normal"
          style={{
            /* 
              mask-image adds a "cutout" fade effect to the bottom or edges if the user supplies a standard image.
              For a true effect, replace the src with a fully transparent character PNG! 
            */
            maskImage: "radial-gradient(ellipse at 50% 40%, black 50%, transparent 68%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 50%, transparent 68%)",
          }}
        />
      </motion.div>

      {/* Layer 4 Front: Overlapping elements, Text outlines, Badges */}
      <motion.div className="absolute inset-0 z-40 pointer-events-none">
        
        {/* Outlined text perfectly matching the background one */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ x: textX, y: textY }}
        >
          <h1 className="font-black text-[22vw] leading-none text-transparent stroke-text whitespace-nowrap -rotate-2 select-none tracking-tighter">
            {mainBgText}
          </h1>
        </motion.div>

        {/* Small floating info blocks wrapped in a motion div for inverse float */}
        <motion.div
          className="absolute inset-0"
          style={{ x: floatingBadgesX, y: floatingBadgesY }}
        >
          {/* Top Left Info (Magazine style) */}
          <div
            className="absolute top-12 left-12 flex flex-col gap-2 border-l-[3px] pl-4"
            style={{ borderColor: themeColor }}
          >
            <div className="flex gap-2 items-center">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
               <div className="text-[10px] font-mono tracking-[0.2em] text-white/70">
                 CHARACTER PROFILE
               </div>
            </div>
            
            <div className="text-sm font-bold tracking-widest text-white">
              {number} // {nameEn}
            </div>
            <div className="text-[8px] font-mono tracking-wider text-white/50 max-w-[200px] leading-relaxed uppercase mt-2">
              The currently available intelligence regarding this subject. Top
              secret classification.
            </div>
          </div>

          {/* Accent Banner / Name box */}
          <div className="absolute top-24 right-16 flex flex-col items-end">
            <div
              className="relative px-8 py-6 border border-black/20 shadow-[10px_10px_0px_rgba(0,0,0,0.8)] transform rotate-3 overflow-hidden"
              style={{ backgroundColor: themeColor }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full bg-white/20 opacity-40 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)",
                }}
              ></div>
              <div className="text-[10px] font-mono font-bold text-black border-b border-black/40 pb-1 mb-2 tracking-widest uppercase">
                {nameEn}
              </div>
              <h2 className="text-7xl md:text-9xl font-black text-black leading-none tracking-tighter mix-blend-color-burn">
                {nameJp}
              </h2>
            </div>
          </div>

          {/* Vertical Big Text */}
          <div className="absolute bottom-1/4 left-10 md:left-24 flex gap-6 z-50">
            <div className="writing-vertical-rl text-[14vw] font-black text-white/5 select-none opacity-80 mix-blend-screen -translate-y-12">
              MYSTERY
            </div>
            <div className="writing-vertical-rl text-3xl font-black text-white mix-blend-overlay tracking-[0.5em] mt-32">
              (記錄)
            </div>
            <div className="writing-vertical-rl text-3xl font-black text-white/70 tracking-[0.5em] mt-16 shadow-lg">
              (檔案)
            </div>
          </div>

          {/* Polaroids / Badges bottom right */}
          <div className="absolute bottom-[15%] right-[10%] flex gap-6 z-50">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className="relative w-32 p-2 bg-[#f0f0f0] shadow-2xl border border-white/50 hover:z-50 pointer-events-auto"
                style={{ transform: `rotate(${b.rot}deg) translateY(${idx * 30}px)` }}
              >
                <div className="w-full aspect-square bg-gray-800 mb-2 overflow-hidden retro-filter border border-black/10">
                  <img
                    src={b.img}
                    className="w-full h-full object-cover saturate-50 contrast-125"
                    alt="badge"
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">
                    {b.label}
                  </span>
                  <span className="text-[8px] font-mono text-gray-500">
                    {(idx + 1) * 99}
                  </span>
                </div>
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/50 backdrop-blur-sm shadow-sm rotate-[-4deg]"></div>
              </div>
            ))}
          </div>

          {/* Graphic Element */}
          <div className="absolute bottom-12 right-1/4 flex items-end gap-2" style={{ color: themeColor }}>
            <span className="text-9xl font-black italic block translate-y-6">9</span>
            <span className="text-3xl font-bold not-italic font-mono mb-2">(99)</span>
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
};

export default function App() {
  return (
    <main className="w-full bg-black text-white">
      {/* Global Noise Layer for Analog Feel */}
      <div className="noise-overlay pointer-events-none"></div>

      {/* Panel 1: Shiraishi An style */}
      <Panel
        baseColor="#072224"
        clipPath="polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)"
        bgImage="https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=2000&auto=format&fit=crop" // Cityscape/Cyberpunk
        charImage="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" 
        mainBgText="SHIRAISHI"
        nameJp="白石 杏"
        nameEn="SHIRAISHI AN"
        themeColor="#e69138" // Warm orange
        number="001"
        badges={[
          {
            img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=300&q=80",
            label: "FREQUENCY",
            rot: 6,
          },
          {
            img: "https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&w=300&q=80",
            label: "CLOSE UP",
            rot: -4,
          },
        ]}
      />

      {/* Panel 2: Azusawa Kohane style */}
      <Panel
        baseColor="#321217"
        clipPath="polygon(0 0, 100% 10%, 100% 100%, 0 90%)"
        bgImage="https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=2000&auto=format&fit=crop" // Cozy room
        charImage="https://images.unsplash.com/photo-1621647466860-22c95a0eb305?q=80&w=1000&auto=format&fit=crop"
        mainBgText="AZUSAWA"
        nameJp="小豆沢 こはね"
        nameEn="KOHANE"
        themeColor="#cc0000" // Red
        number="002"
        badges={[
          {
            img: "https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&w=300&q=80",
            label: "SENTIMENTAL",
            rot: -10,
          },
          {
            img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&q=80",
            label: "CHARM",
            rot: 12,
          },
        ]}
      />
    </main>
  );
}
