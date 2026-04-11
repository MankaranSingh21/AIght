"use client";

import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "neon";
type ButtonSize    = "sm" | "md" | "lg";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-moss-500 text-parchment border border-moss-600 hover:bg-moss-600 shadow-moss",
  secondary:
    "bg-parchment text-espresso border border-moss-300 hover:bg-moss-50 shadow-card",
  ghost:
    "bg-transparent text-forest border border-forest/30 hover:bg-forest/8",
  neon:
    "bg-espresso text-neon-lime border border-neon-lime/40 hover:shadow-glow-neon",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2 rounded-xl",
  md: "text-base px-6 py-3 rounded-2xl",
  lg: "text-lg px-8 py-4 rounded-3xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`
        font-body font-semibold tracking-wide
        transition-colors duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
