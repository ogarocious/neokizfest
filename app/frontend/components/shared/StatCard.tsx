import React from "react";
import { Stack, Text, Box } from "@mantine/core";
import { colors, responsiveText, glass } from "../../styles/theme";

type StatVariant = "default" | "primary" | "success" | "muted";

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: StatVariant;
  icon?: React.ReactNode;
  /** Show as inline/compact instead of card */
  inline?: boolean;
}

const variantStyles: Record<StatVariant, { valueColor: string; labelColor: string }> = {
  default: {
    valueColor: colors.textPrimary,
    labelColor: colors.textMuted,
  },
  primary: {
    valueColor: colors.primary,
    labelColor: colors.textSecondary,
  },
  success: {
    valueColor: colors.success,
    labelColor: colors.textSecondary,
  },
  muted: {
    valueColor: colors.textSecondary,
    labelColor: colors.textMuted,
  },
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  variant = "default",
  icon,
  inline = false,
}) => {
  const styles = variantStyles[variant];

  if (inline) {
    return (
      <Box
        p="sm"
        style={{
          ...glass.subtle,
          borderRadius: 8,
        }}
      >
        <Stack gap={2} align="center">
          <Text
            fw={700}
            style={{
              fontSize: responsiveText.sectionTitle,
              color: styles.valueColor,
            }}
          >
            {value}
          </Text>
          <Text
            style={{
              fontSize: responsiveText.xs,
              color: styles.labelColor,
            }}
          >
            {label}
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      p="lg"
      style={{
        ...glass.default,
        borderRadius: 12,
      }}
    >
      <Stack gap="sm" align="center">
        {icon && (
          <Box
            style={{
              color: styles.valueColor,
              opacity: 0.8,
            }}
          >
            {icon}
          </Box>
        )}
        <Text
          fw={700}
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            color: styles.valueColor,
            lineHeight: 1,
          }}
        >
          {value}
        </Text>
        <Text
          ta="center"
          style={{
            fontSize: responsiveText.small,
            color: styles.labelColor,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </Text>
      </Stack>
    </Box>
  );
};

export default StatCard;
