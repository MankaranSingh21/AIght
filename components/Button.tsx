"use client";

import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize    = "sm" | "md" | "lg";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-inverse border border-accent-dim hover:bg-accent-dim",
  secondary:
    "bg-raised text-primary border border-subtle hover:border-emphasis",
  ghost:
    "bg-transparent text-primary border border-subtle hover:border-emphasis hover:text-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2 rounded-md",
  md: "text-base px-6 py-3 rounded-md",
  lg: "text-base px-8 py-3.5 rounded-md",
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
        font-sans font-medium tracking-wide
        transition-colors duration-150
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
