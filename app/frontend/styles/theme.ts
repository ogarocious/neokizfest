// Neo Kizomba Festival - Dark Theme Constants
// Central place for all theme colors and styles

export const colors = {
  // Primary brand colors
  primary: "#F45D00",
  primaryDark: "#A25A3C",
  primaryLight: "#F19D58",

  // Background colors
  bgDark: "#0f0f0f",
  bgMedium: "#1a1a1a",
  bgLight: "#252525",
  bgCard: "rgba(30, 30, 30, 0.8)",
  bgCardHover: "rgba(40, 40, 40, 0.9)",

  // Text colors
  textPrimary: "#E8E0D8",
  textSecondary: "#C7ACA4",
  textMuted: "#9A8F85",
  textDim: "#6B5D52",

  // Accent colors
  success: "#228B22",
  successLight: "#32CD32",
  error: "#ff6b6b",
  warning: "#FF8C00",
  info: "#0066CC",

  // Border colors
  borderPrimary: "rgba(244, 93, 0, 0.2)",
  borderLight: "rgba(244, 93, 0, 0.15)",
  borderMuted: "rgba(244, 93, 0, 0.1)",
};

// Gradient presets
export const gradients = {
  primaryButton: "linear-gradient(135deg, #F45D00 0%, #A25A3C 100%)",
  cardBackground: "linear-gradient(135deg, rgba(244, 93, 0, 0.1) 0%, rgba(162, 90, 60, 0.15) 100%)",
  pageBackground: `
    radial-gradient(circle at 20% 80%, rgba(162, 90, 60, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(244, 93, 0, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #141414 100%)
  `,
  successCard: "linear-gradient(135deg, rgba(34, 139, 34, 0.1) 0%, rgba(50, 205, 50, 0.15) 100%)",
};

// Common component styles
export const componentStyles = {
  paper: {
    background: colors.bgCard,
    backdropFilter: "blur(10px)",
    border: `1px solid ${colors.borderLight}`,
  },
  paperHighlight: {
    background: gradients.cardBackground,
    border: `1px solid ${colors.borderPrimary}`,
  },
  input: {
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    borderColor: "rgba(244, 93, 0, 0.3)",
    color: colors.textPrimary,
    "&:focus": {
      borderColor: colors.primary,
    },
    "&::placeholder": {
      color: colors.textDim,
    },
  },
  button: {
    background: gradients.primaryButton,
    color: "white",
  },
};

// Input styles for Mantine components
export const inputStyles = {
  label: { color: colors.textPrimary },
  input: componentStyles.input,
  description: { color: colors.textMuted },
};

// Export a helper function for styled papers
export const getPaperStyle = (variant: "default" | "highlight" | "success" = "default") => {
  switch (variant) {
    case "highlight":
      return componentStyles.paperHighlight;
    case "success":
      return {
        background: gradients.successCard,
        border: `1px solid rgba(34, 139, 34, 0.2)`,
      };
    default:
      return componentStyles.paper;
  }
};

// Mobile-first responsive text sizing standards
export const responsiveText = {
  // Page titles
  pageTitle: "clamp(1.5rem, 5vw, 2.5rem)",
  // Section titles
  sectionTitle: "clamp(1rem, 3vw, 1.25rem)",
  // Body text
  body: "clamp(0.8rem, 2.5vw, 1rem)",
  // Small text
  small: "clamp(0.75rem, 2vw, 0.875rem)",
  // Extra small / labels
  xs: "clamp(0.7rem, 1.8vw, 0.8rem)",
  // Large emphasis text
  large: "clamp(0.9rem, 3vw, 1.125rem)",
};

// Glassmorphism styles
export const glass = {
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

// Mobile-responsive input styles
export const mobileInputStyles = {
  label: {
    color: colors.textPrimary,
    fontSize: responsiveText.small,
    fontWeight: 500,
  },
  input: {
    ...componentStyles.input,
    fontSize: responsiveText.body,
    padding: "10px 12px",
  },
  description: {
    color: colors.textMuted,
    fontSize: responsiveText.xs,
  },
  error: {
    fontSize: responsiveText.xs,
  },
};
