import React from "react";
import { Text, Title, Paper, Button, TextInput, NumberInput } from "@mantine/core";
import type { TextProps, TitleProps, PaperProps, ButtonProps, TextInputProps, NumberInputProps } from "@mantine/core";
import { colors, gradients, inputStyles, getPaperStyle } from "../../styles/theme";

// ==================== TEXT COMPONENTS ====================

interface StyledTextProps extends Omit<TextProps, "c"> {
  variant?: "primary" | "secondary" | "muted" | "dim" | "accent" | "success" | "error";
  children: React.ReactNode;
}

export const StyledText: React.FC<StyledTextProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  const colorMap = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    dim: colors.textDim,
    accent: colors.primary,
    success: colors.success,
    error: colors.error,
  };

  return (
    <Text c={colorMap[variant]} {...props}>
      {children}
    </Text>
  );
};

// Page title component
interface PageTitleProps extends Omit<TitleProps, "c" | "style"> {
  children: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({ children, ...props }) => (
  <Title
    order={1}
    fw={700}
    ta="center"
    style={{
      color: colors.primary,
      fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
      letterSpacing: "-0.03em",
    }}
    {...props}
  >
    {children}
  </Title>
);

// Section title component
interface SectionTitleProps extends Omit<TitleProps, "c" | "style"> {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, ...props }) => (
  <Title
    order={2}
    fw={700}
    style={{
      color: colors.primary,
      fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
      letterSpacing: "-0.02em",
    }}
    {...props}
  >
    {children}
  </Title>
);

// ==================== PAPER COMPONENTS ====================

interface StyledPaperProps extends Omit<PaperProps, "style"> {
  variant?: "default" | "highlight" | "success";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const StyledPaper: React.FC<StyledPaperProps> = ({
  variant = "default",
  children,
  style,
  ...props
}) => (
  <Paper
    radius="md"
    style={{
      ...getPaperStyle(variant),
      ...style,
    }}
    {...props}
  >
    {children}
  </Paper>
);

// ==================== BUTTON COMPONENTS ====================

interface PrimaryButtonProps extends Omit<ButtonProps, "style"> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => (
  <Button
    style={{
      background: gradients.primaryButton,
    }}
    {...props}
  >
    {children}
  </Button>
);

// ==================== INPUT COMPONENTS ====================

interface StyledTextInputProps extends TextInputProps {}

export const StyledTextInput: React.FC<StyledTextInputProps> = (props) => (
  <TextInput
    styles={inputStyles}
    {...props}
  />
);

interface StyledNumberInputProps extends NumberInputProps {}

export const StyledNumberInput: React.FC<StyledNumberInputProps> = (props) => (
  <NumberInput
    styles={inputStyles}
    {...props}
  />
);

// ==================== UTILITY EXPORTS ====================

// Re-export theme colors for direct use
export { colors, gradients, inputStyles, getPaperStyle };
