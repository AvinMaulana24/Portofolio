import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, Download, Sun, Moon } from "lucide-react";
import MobileNavigation from "./MobileNavigation";
import NavigationIndicator from "./NavigationIndicator";
import "./Navbar.css";

const NAV_ITEMS = [
  { name: "HOME", id: "home" },
  { name: "ABOUT", id: "about" },
  { name: "EXPERTISE", id: "skills" },
  { name: "PROJECTS", id: "projects" },
  { name: "JOURNEY", id: "journey" },
  { name: "CONTACT", id: "contact" },
];

export default function Navbar({ dark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll Detection & Active Section Tracker
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_ITEMS.map((item) =>
        document.getElementById(item.id),
      );
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;

      sections.forEach((section, index) => {
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(NAV_ITEMS[index].id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`neural-nav ${scrolled ? "compact" : ""}`}>
        {/* A. BRAND IDENTITY */}
        <a href="#home" className="neural-logo">
          <div className="neural-logo-icon">
            <span className="font-mono text-xs font-bold">&lt;/&gt;</span>
          </div>
          <div className="flex flex-col">
            <span className="tracking-tight text-[#DCD7FF]">Profile</span>
            <span className="text-[10px] text-[#A49BEE] tracking-widest font-mono">
              Avin
            </span>
          </div>
        </a>

        {/* B. NAVIGATION SYSTEM */}
        <nav aria-label="Main Navigation">
          <ul className="neural-links">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="neural-link-item">
                  <a
                    href={`#${item.id}`}
                    className={`neural-link ${isActive ? "active" : ""}`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-sun shadow-[0_0_8px_#FFC21A]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* D. FLOATING INTERACTIVE ELEMENTS (Tanpa Status Jam) */}
        <div className="neural-actions">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-[#39326D] text-[#DCD7FF] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
            aria-label="Toggle Theme"
          >
            {dark ? <Sun size={16} className="text-sun" /> : <Moon size={16} />}
          </button>

          {/* Download CV Button */}
          <a
            href={import.meta.env.BASE_URL + "cv.pdf"}
            download
            className="neural-cta"
          >
            <Download size={14} />
            <span>RESUME</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-toggle"
            aria-label="Open Mobile Menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Fullscreen Overlay */}
      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
