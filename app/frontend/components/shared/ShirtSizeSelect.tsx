import React from "react";
import { Select, SegmentedControl, Text } from "@mantine/core";
import { colors, gradients } from "../../styles/theme";
import type { ShirtSize } from "../../types/refund";

const SHIRT_SIZES: { value: ShirtSize; label: string }[] = [
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "X-Large" },
  { value: "2XL", label: "2X-Large" },
];

interface ShirtSizeSelectProps {
  value: ShirtSize | null;
  onChange: (value: ShirtSize | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: "select" | "segmented";
  label?: string;
}

const ShirtSizeSelect: React.FC<ShirtSizeSelectProps> = ({
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  variant = "select",
  label = "Size",
}) => {
  if (variant === "segmented") {
    return (
      <div>
        {label && (
          <Text size="sm" fw={500} mb="xs" c={colors.textPrimary}>
            {label}
            {required && <span style={{ color: colors.primary }}> *</span>}
          </Text>
        )}
        <SegmentedControl
          value={value || ""}
          onChange={(val) => onChange(val as ShirtSize)}
          data={SHIRT_SIZES.map((s) => ({ value: s.value, label: s.value }))}
          disabled={disabled}
          fullWidth
          styles={{
            root: {
              backgroundColor: "rgba(244, 93, 0, 0.1)",
            },
            indicator: {
              background: gradients.primaryButton,
            },
            label: {
              color: colors.textPrimary,
              fontWeight: 500,
              "&[data-active]": {
                color: "white",
              },
            },
          }}
        />
        {error && (
          <Text size="xs" c={colors.error} mt={4}>
            {error}
          </Text>
        )}
      </div>
    );
  }

  return (
    <Select
      label={label}
      placeholder="Select size"
      data={SHIRT_SIZES}
      value={value}
      onChange={(val) => onChange(val as ShirtSize | null)}
      error={error}
      required={required}
      disabled={disabled}
      styles={{
        input: {
          borderColor: `rgba(244, 93, 0, 0.3)`,
          "&:focus": {
            borderColor: colors.primary,
          },
        },
      }}
    />
  );
};

export default ShirtSizeSelect;
export { SHIRT_SIZES };
