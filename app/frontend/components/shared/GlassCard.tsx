import React from "react";
import { Paper, type PaperProps } from "@mantine/core";

type GlassVariant = "default" | "subtle" | "accent";

interface GlassCardProps extends Omit<PaperProps, "style"> {
  variant?: GlassVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantStyles: Record<GlassVariant, React.CSSProperties> = {
  default: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  subtle: {
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  },
  accent: {
    background: "linear-gradient(135deg, rgba(244, 93, 0, 0.08) 0%, rgba(162, 90, 60, 0.12) 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(244, 93, 0, 0.15)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
};

const GlassCard: React.FC<GlassCardProps> = ({
  variant = "default",
  children,
  style,
  radius = "lg",
  p = { base: "md", sm: "lg" },
  ...props
}) => {
  return (
    <Paper
      radius={radius}
      p={p}
      style={{
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default GlassCard;
