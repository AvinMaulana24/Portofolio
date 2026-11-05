import { motion } from "framer-motion";

export function ConcavePanel({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  // Variasi bentuk lekukan asimetris dan concave cutout yang berbeda tiap section
  const variants = {
    hero: "clip-concave-hero",
    about: "clip-concave-about",
    skills: "clip-concave-skills",
    projects: "clip-concave-projects",
    journey: "clip-concave-journey",
    contact: "clip-concave-contact",
    default: "clip-concave-standard",
  };

  return (
    <motion.div
      className={`relative overflow-hidden p-8 md:p-14 bg-[#39326D] text-[#DCD7FF] shadow-[0_25px_60px_-15px_rgba(20,18,40,0.7)] border border-[#8880D6]/30 backdrop-blur-2xl ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {/* Efek Ambient Light & Gradasi Inner Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8880D6]/20 via-transparent to-[#29264D]/50 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
