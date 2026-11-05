import { motion } from "framer-motion";

export default function NavigationIndicator({ active }) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-1 flex items-center pointer-events-none">
      <motion.div
        className="w-full h-8 bg-sun rounded-full shadow-[0_0_12px_#FFC21A]"
        layoutId="neuralIndicator"
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
    </div>
  );
}
