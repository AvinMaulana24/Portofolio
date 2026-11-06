import { motion } from "framer-motion";
import { Download, Moon, Sun } from "lucide-react";
import NavigationItem, { slotMotion } from "./NavigationItem";

/* Geometri busur per breakpoint */
const ARC = {
  desktop: { rx: 420, ry: 150, pad: 170, extra: 92 },
  tablet: { rx: 295, ry: 150, pad: 120, extra: 84 },
};
const DOME_BELOW = 52; // dome menjulur ke bawah, membungkus tombol

function arcPoints(count, rx, ry, startDeg = 168, endDeg = 12) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const a = ((startDeg + (endDeg - startDeg) * t) * Math.PI) / 180;
    return { x: Math.cos(a) * rx, y: Math.sin(a) * ry };
  });
}

function ExtraAction({
  side,
  x,
  label,
  icon: Icon,
  onClick,
  href,
  download,
  reduce,
  index,
  total,
}) {
  const props = {
    className: "fnav-item fnav-item--extra",
    "aria-label": label,
    ...slotMotion({ x, y: 0, index, total, reduce }),
    ...(reduce
      ? {}
      : { whileHover: { y: -4, scale: 1.06 }, whileTap: { scale: 0.94 } }),
  };
  const inner = (
    <>
      <span className="fnav-orb fnav-orb--extra">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="fnav-chip fnav-chip--extra">{label}</span>
    </>
  );
  return (
    <div className="fnav-slot" style={{ left: x, top: 0 }} data-side={side}>
      {href ? (
        <motion.a href={href} download={download} onClick={onClick} {...props}>
          {inner}
        </motion.a>
      ) : (
        <motion.button type="button" onClick={onClick} {...props}>
          {inner}
        </motion.button>
      )}
    </div>
  );
}

function ArcDock({
  items,
  active,
  onSelect,
  onClose,
  mode,
  dark,
  toggleTheme,
  resumeHref,
  reduce,
}) {
  const { rx, ry, pad, extra } = ARC[mode];
  const points = arcPoints(items.length, rx, ry);
  const first = points[0];
  const last = points[points.length - 1];
  const domeW = rx * 2 + pad;
  const domeH = ry + 130;
  const r = domeW / 2;

  const arcPath = `M ${first.x} ${-first.y} A ${rx} ${ry} 0 0 1 ${last.x} ${-last.y}`;

  return (
    <nav className="fnav-menu" id="fnav-menu" aria-label="Main navigation">
      {/* Panel organik: dome kaca yang tumbuh dari tombol */}
      <motion.div
        aria-hidden="true"
        className="fnav-dome"
        style={{
          width: domeW,
          height: domeH + DOME_BELOW,
          left: -r,
          top: -domeH,
          borderRadius: `${r}px ${r}px 48px 48px / ${domeH}px ${domeH}px 48px 48px`,
          transformOrigin: `50% ${domeH}px`,
        }}
        initial={
          reduce ? { opacity: 0 } : { opacity: 0, scale: 0.12, scaleY: 0.05 }
        }
        animate={
          reduce
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: 1,
                scaleY: 1,
                transition: {
                  type: "spring",
                  stiffness: 140,
                  damping: 17,
                  mass: 1,
                },
              }
        }
        exit={
          reduce
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.12,
                scaleY: 0.05,
                transition: {
                  duration: 0.34,
                  ease: [0.5, 0, 0.75, 0],
                  delay: 0.1,
                },
              }
        }
      />

      {/* Garis penghubung animasi */}
      <svg className="fnav-arc" width="1" height="1" aria-hidden="true">
        <motion.path
          d={arcPath}
          className="fnav-arc-line"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: reduce ? 0.01 : 0.9,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.2 } }}
        />
        <motion.path
          d={arcPath}
          className="fnav-arc-flow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.9, duration: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        />
      </svg>

      {items.map((item, i) => (
        <NavigationItem
          key={item.id}
          item={item}
          index={i}
          total={items.length + 2}
          active={active === item.id}
          variant="arc"
          position={points[i]}
          onSelect={onSelect}
          reduce={reduce}
        />
      ))}

      {toggleTheme && (
        <ExtraAction
          side="left"
          x={-extra}
          label={dark ? "Light" : "Dark"}
          icon={dark ? Sun : Moon}
          onClick={toggleTheme}
          reduce={reduce}
          index={items.length}
          total={items.length + 2}
        />
      )}
      <ExtraAction
        side="right"
        x={extra}
        label="Resume"
        icon={Download}
        href={resumeHref}
        download
        onClick={onClose}
        reduce={reduce}
        index={items.length + 1}
        total={items.length + 2}
      />
    </nav>
  );
}

function MobileSheet({
  items,
  active,
  onSelect,
  onClose,
  dark,
  toggleTheme,
  resumeHref,
  reduce,
}) {
  return (
    <nav
      className="fnav-menu fnav-menu--mobile"
      id="fnav-menu"
      aria-label="Main navigation"
    >
      <motion.div
        className="fnav-sheet"
        style={{ transformOrigin: "50% calc(100% + 46px)" }}
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.15, borderRadius: "50%" }
        }
        animate={
          reduce
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: 1,
                borderRadius: "46px 30px 42px 38px / 34px 44px 38px 46px",
                transition: {
                  type: "spring",
                  stiffness: 190,
                  damping: 18,
                  mass: 0.9,
                },
              }
        }
        exit={
          reduce
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.15,
                borderRadius: "50%",
                transition: {
                  duration: 0.3,
                  ease: [0.5, 0, 0.75, 0],
                  delay: 0.08,
                },
              }
        }
      >
        <div className="fnav-grid">
          {items.map((item, i) => (
            <NavigationItem
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              active={active === item.id}
              variant="tile"
              onSelect={onSelect}
              reduce={reduce}
            />
          ))}
        </div>

        <div className="fnav-footer">
          {toggleTheme && (
            <button type="button" className="fnav-pill" onClick={toggleTheme}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{dark ? "Light mode" : "Dark mode"}</span>
            </button>
          )}
          <a
            href={resumeHref}
            download
            className="fnav-pill fnav-pill--primary"
            onClick={onClose}
          >
            <Download size={16} />
            <span>Resume</span>
          </a>
        </div>
      </motion.div>
    </nav>
  );
}

export default function NavigationMenu(props) {
  return props.mode === "mobile" ? (
    <MobileSheet {...props} />
  ) : (
    <ArcDock {...props} />
  );
}
