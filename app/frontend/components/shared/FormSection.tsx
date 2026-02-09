import React from "react";
import { Stack, Text, Box } from "@mantine/core";
import { colors, responsiveText } from "../../styles/theme";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Spacing between child elements */
  gap?: "xs" | "sm" | "md" | "lg";
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  gap = "md",
}) => {
  return (
    <Box>
      <Stack gap={4} mb="sm">
        <Text
          fw={600}
          style={{
            fontSize: responsiveText.sectionTitle,
            color: colors.textPrimary,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={{
              fontSize: responsiveText.small,
              color: colors.textMuted,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Text>
        )}
      </Stack>
      <Stack gap={gap}>{children}</Stack>
    </Box>
  );
};

export default FormSection;
