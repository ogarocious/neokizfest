import React from "react";
import { Group, Text, Box, Stack } from "@mantine/core";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";

type AlertVariant = "error" | "warning" | "info";

interface AlertMessageProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
}

const variantConfig: Record<
  AlertVariant,
  { icon: React.FC<{ size: number; stroke: number }>; color: string; bgColor: string }
> = {
  error: {
    icon: IconAlertCircle,
    color: colors.error,
    bgColor: "rgba(255, 107, 107, 0.1)",
  },
  warning: {
    icon: IconAlertTriangle,
    color: colors.warning,
    bgColor: "rgba(255, 140, 0, 0.1)",
  },
  info: {
    icon: IconInfoCircle,
    color: colors.info,
    bgColor: "rgba(0, 102, 204, 0.1)",
  },
};

const AlertMessage: React.FC<AlertMessageProps> = ({
  variant = "error",
  title,
  message,
  onDismiss,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Box
      p="md"
      style={{
        background: config.bgColor,
        borderRadius: 8,
        border: `1px solid ${config.color}30`,
      }}
    >
      <Group align="flex-start" justify="space-between" wrap="nowrap">
        <Group align="flex-start" gap="sm" wrap="nowrap">
          <Box mt={2}>
            <Icon size={20} stroke={2} color={config.color} />
          </Box>
          <Stack gap={4}>
            {title && (
              <Text
                fw={600}
                style={{
                  fontSize: responsiveText.body,
                  color: config.color,
                }}
              >
                {title}
              </Text>
            )}
            <Text
              style={{
                fontSize: responsiveText.small,
                color: colors.textSecondary,
                lineHeight: 1.5,
              }}
            >
              {message}
            </Text>
          </Stack>
        </Group>

        {onDismiss && (
          <Box
            component="button"
            onClick={onDismiss}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textMuted,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textMuted;
            }}
          >
            <IconX size={18} />
          </Box>
        )}
      </Group>
    </Box>
  );
};

export default AlertMessage;
