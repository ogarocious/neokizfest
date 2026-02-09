import React from "react";
import { Stack, Text, Box } from "@mantine/core";
import { colors, responsiveText } from "../../styles/theme";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  description,
  children,
}) => {
  return (
    <Box>
      <Stack gap={4}>
        <Text
          component="label"
          fw={500}
          style={{
            fontSize: responsiveText.small,
            color: colors.textPrimary,
          }}
        >
          {label}
          {required && (
            <Text component="span" c={colors.error} ml={4}>
              *
            </Text>
          )}
        </Text>

        {description && (
          <Text
            style={{
              fontSize: responsiveText.xs,
              color: colors.textMuted,
              lineHeight: 1.4,
            }}
          >
            {description}
          </Text>
        )}

        {children}

        {error && (
          <Text
            style={{
              fontSize: responsiveText.xs,
              color: colors.error,
              lineHeight: 1.4,
            }}
          >
            {error}
          </Text>
        )}
      </Stack>
    </Box>
  );
};

export default FormField;
