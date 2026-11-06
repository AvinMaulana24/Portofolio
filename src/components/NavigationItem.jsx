import { motion } from "framer-motion";

/**
 * Preset animasi muncul/hilang untuk setiap elemen menu.
 * Elemen "terbit" dari titik pusat tombol (x, y adalah posisi akhirnya
 * relatif terhadap tombol), dengan spring + blur-to-sharp + stagger.
 */
export function slotMotion({ x = 0, y = 0, index = 0, total = 1, reduce }) {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.15 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  const delay = 0.14 + index * 0.055;
  return {
    initial: { opacity: 0, scale: 0.3, x: -x, y, filter: "blur(10px)" },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 230,
        damping: 19,
        mass: 0.9,
        delay,
        filter: { duration: 0.45, delay },
        opacity: { duration: 0.3, delay },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.3,
      x: -x,
      y,
      filter: "blur(6px)",
      transition: {
        duration: 0.28,
        ease: [0.4, 0, 0.2, 1],
        delay: (total - 1 - index) * 0.022,
      },
    },
  };
}

export default function NavigationItem({
  item,
  index,
  total,
  active,
  variant = "arc",
  position = { x: 0, y: 0 },
  onSelect,
  reduce,
}) {
  const Icon = item.icon;
  const num = String(index + 1).padStart(2, "0");
  const isArc = variant === "arc";

  const motionProps = slotMotion({
    x: isArc ? position.x : 0,
    y: isArc ? position.y : 26,
    index,
    total,
    reduce,
  });

  const hoverProps = reduce
    ? {}
    : {
        whileHover: { y: isArc ? -6 : -2, scale: isArc ? 1.06 : 1.03 },
        whileTap: { scale: 0.95 },
      };

  const link = (
    <motion.a
      href={`#${item.id}`}
      className={`fnav-item fnav-item--${variant}`}
      data-active={active}
      data-parity={index % 2 === 0 ? "a" : "b"}
      aria-current={active ? "location" : undefined}
      onClick={(e) => {
        e.preventDefault();
        onSelect(item.id);
      }}
      {...motionProps}
      {...hoverProps}
    >
      {isArc ? (
        <>
          <span className="fnav-orb">
            <Icon size={22} strokeWidth={1.8} />
            <span className="fnav-badge-num">{num}</span>
          </span>
          <span className="fnav-chip">
            {active && <span className="fnav-dot" />}
            {item.name}
          </span>
        </>
      ) : (
        <>
          <span className="fnav-orb fnav-orb--tile">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <span className="fnav-tile-text">
            <span className="fnav-tile-num">{num}</span>
            <span className="fnav-tile-name">{item.name}</span>
          </span>
          {active && <span className="fnav-dot fnav-dot--tile" />}
        </>
      )}
    </motion.a>
  );

  if (isArc) {
    return (
      <div className="fnav-slot" style={{ left: position.x, top: -position.y }}>
        {link}
      </div>
    );
  }
  return link;
}
