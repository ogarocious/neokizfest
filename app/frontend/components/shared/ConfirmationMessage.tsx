import React from "react";
import { Stack, Title, Text, Box } from "@mantine/core";
import { IconCircleCheck, IconHeart } from "@tabler/icons-react";
import { colors, responsiveText, glass } from "../../styles/theme";
import GlassCard from "./GlassCard";

type ConfirmationVariant = "success" | "gratitude";

interface ConfirmationMessageProps {
  variant?: ConfirmationVariant;
  title: string;
  message?: string;
  confirmationNumber?: string;
  children?: React.ReactNode;
}

const variantConfig: Record<
  ConfirmationVariant,
  { icon: React.ReactNode; color: string; bgGradient: string }
> = {
  success: {
    icon: <IconCircleCheck size={48} stroke={1.5} />,
    color: colors.success,
    bgGradient: "linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(50, 205, 50, 0.12) 100%)",
  },
  gratitude: {
    icon: <IconHeart size={48} stroke={1.5} />,
    color: colors.primary,
    bgGradient: glass.accent.background,
  },
};

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({
  variant = "success",
  title,
  message,
  confirmationNumber,
  children,
}) => {
  const config = variantConfig[variant];

  return (
    <GlassCard
      variant="accent"
      style={{
        background: config.bgGradient,
        borderColor: `${config.color}20`,
      }}
    >
      <Stack align="center" gap="md" py="md">
        {/* Icon */}
        <Box
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `${config.color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.color,
          }}
        >
          {config.icon}
        </Box>

        {/* Title */}
        <Title
          order={2}
          ta="center"
          style={{
            fontSize: responsiveText.pageTitle,
            color: config.color,
          }}
        >
          {title}
        </Title>

        {/* Message */}
        {message && (
          <Text
            ta="center"
            maw={450}
            style={{
              fontSize: responsiveText.body,
              color: colors.textSecondary,
              lineHeight: 1.6,
            }}
          >
            {message}
          </Text>
        )}

        {/* Confirmation Number */}
        {confirmationNumber && (
          <Box
            p="md"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: 8,
              border: `1px solid ${config.color}30`,
            }}
          >
            <Text
              ta="center"
              style={{
                fontSize: responsiveText.small,
                color: colors.textMuted,
              }}
            >
              Confirmation Number
            </Text>
            <Text
              ta="center"
              fw={700}
              style={{
                fontSize: responsiveText.pageTitle,
                color: colors.textPrimary,
                letterSpacing: "0.05em",
              }}
            >
              {confirmationNumber}
            </Text>
          </Box>
        )}

        {/* Additional content */}
        {children}
      </Stack>
    </GlassCard>
  );
};

export default ConfirmationMessage;
