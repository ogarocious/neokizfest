import React from "react";
import { Text, type TextProps } from "@mantine/core";
import { colors } from "../../styles/theme";

type TextVariant = "body" | "small" | "label" | "heading";

interface ResponsiveTextProps extends Omit<TextProps, "size" | "style"> {
  variant?: TextVariant;
  color?: "primary" | "muted" | "secondary" | "inherit";
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const variantConfig: Record<TextVariant, { fontSize: string; lineHeight: number }> = {
  body: {
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    lineHeight: 1.6,
  },
  small: {
    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
    lineHeight: 1.5,
  },
  label: {
    fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
    lineHeight: 1.4,
  },
  heading: {
    fontSize: "clamp(1rem, 3vw, 1.25rem)",
    lineHeight: 1.3,
  },
};

const colorMap = {
  primary: colors.textPrimary,
  muted: colors.textMuted,
  secondary: colors.textSecondary,
  inherit: "inherit",
};

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  variant = "body",
  color = "primary",
  children,
  style,
  ...props
}) => {
  const config = variantConfig[variant];

  return (
    <Text
      c={colorMap[color]}
      style={{
        fontSize: config.fontSize,
        lineHeight: config.lineHeight,
        ...style,
      }}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ResponsiveText;
