import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";

const MENU_ITEMS = [
  { name: "HOME", href: "#home" },
  { name: "ABOUT", href: "#about" },
  { name: "EXPERTISE", href: "#skills" },
  { name: "PROJECTS", href: "#projects" },
  { name: "JOURNEY", href: "#journey" },
  { name: "CONTACT", href: "#contact" },
];

export default function MobileNavigation({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
          animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
          exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-[#39326D] flex flex-col justify-between p-8 md:hidden overflow-hidden"
        >
          {/* Background Abstract Geometry */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#8880D6] opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#A49BEE] opacity-15 blur-3xl pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <span className="font-display font-extrabold text-sm tracking-widest text-[#DCD7FF]">
              NEURAL INTERFACE // OS
            </span>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-[#625E91] text-[#DCD7FF] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Links (Tanpa Nomor) */}
          <ul className="flex flex-col gap-4 z-10 my-auto">
            {MENU_ITEMS.map((item, idx) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + idx * 0.07,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <a
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-3 border-b border-[#625E91]/40 text-[#DCD7FF] hover:text-white transition-colors"
                >
                  <span className="font-display text-3xl font-extrabold tracking-tight">
                    {item.name}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FFC21A]"
                  />
                </a>
              </motion.li>
            ))}
          </ul>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between text-xs text-[#DCD7FF]/60 z-10 pt-4 border-t border-[#625E91]/40"
          >
            <span>SYSTEM READY</span>
            <span>PORTFOLIO © 2026</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
