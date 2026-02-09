import React from "react";
import { Button, type ButtonProps } from "@mantine/core";
import { colors, gradients } from "../../styles/theme";

type ButtonVariant = "primary" | "outline" | "success";

interface GradientButtonProps extends Omit<ButtonProps, "variant" | "style"> {
  buttonVariant?: ButtonVariant;
  style?: React.CSSProperties;
  component?: any;
  href?: string;
  target?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: gradients.primaryButton,
    color: "white",
    border: "none",
  },
  outline: {
    background: "transparent",
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
  },
  success: {
    background: "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
    color: "white",
    border: "none",
  },
};

const GradientButton: React.FC<GradientButtonProps> = ({
  buttonVariant = "primary",
  children,
  style,
  component,
  href,
  target,
  type,
  onClick,
  ...props
}) => {
  return (
    <Button
      component={component}
      href={href}
      target={target}
      type={type}
      onClick={onClick}
      style={{
        ...variantStyles[buttonVariant],
        fontWeight: 600,
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
