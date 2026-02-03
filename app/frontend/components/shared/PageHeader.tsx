import React from "react";
import { Stack, Title, Text, Box } from "@mantine/core";
import { colors, gradients, responsiveText } from "../../styles/theme";

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconColor?: "primary" | "success" | "warning";
  /** Use compact mode for smaller mobile display */
  compact?: boolean;
}

const iconColors = {
  primary: {
    background: gradients.primaryButton,
    shadow: "0 6px 24px rgba(244, 93, 0, 0.25)",
  },
  success: {
    background: "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
    shadow: "0 6px 24px rgba(34, 139, 34, 0.25)",
  },
  warning: {
    background: "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
    shadow: "0 6px 24px rgba(255, 140, 0, 0.25)",
  },
};

const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  iconColor = "primary",
  compact = false,
}) => {
  const colorConfig = iconColors[iconColor];

  return (
    <Stack align="center" gap={compact ? "xs" : "sm"} py={compact ? "sm" : "md"}>
      <Box
        style={{
          // Responsive icon container: 50px on mobile, 60px on desktop
          width: "clamp(50px, 10vw, 60px)",
          height: "clamp(50px, 10vw, 60px)",
          borderRadius: "50%",
          background: colorConfig.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: colorConfig.shadow,
        }}
      >
        {icon}
      </Box>

      <Stack align="center" gap={2}>
        <Title
          order={1}
          fw={700}
          ta="center"
          style={{
            color: iconColor === "success" ? "#228B22" : colors.primary,
            // Smaller title on mobile: 1.4rem to 2rem
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Title>
        {subtitle && (
          <Text
            c={colors.textMuted}
            ta="center"
            maw={450}
            px="sm"
            style={{
              fontSize: responsiveText.small,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default PageHeader;
