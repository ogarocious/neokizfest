import React from "react";
import { Stack, Text, TextInput, Box, Group } from "@mantine/core";
import {
  IconMapPin,
  IconArrowRight,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { colors, responsiveText, mobileInputStyles } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import USStateSelect from "../shared/USStateSelect";
import type { ShippingAddress, USState } from "../../types/refund";

const shippingSchema = z.object({
  name: z.string().min(2, "Please enter a name"),
  street: z.string().min(5, "Please enter a street address"),
  city: z.string().min(2, "Please enter a city"),
  state: z.string().min(2, "Please select a state"),
  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingStepProps {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: ShippingAddress | null;
}

const ShippingStep: React.FC<ShippingStepProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: initialData || {
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const onFormSubmit = (data: ShippingFormData) => {
    onSubmit({
      name: data.name,
      street: data.street,
      city: data.city,
      state: data.state as USState,
      zip: data.zip,
    });
  };

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text
          fw={600}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.sectionTitle }}
        >
          Shipping Address
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.body }}>
          Where should we send your commemorative t-shirt?
        </Text>
      </Stack>

      <Box
        style={{
          background: "rgba(244, 93, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(244, 93, 0, 0.3)",
          borderRadius: "8px",
          padding: "12px 16px",
        }}
      >
        <Group gap="xs" align="flex-start">
          <IconInfoCircle size={18} color={colors.warning} style={{ marginTop: 2, flexShrink: 0 }} />
          <Text style={{ fontSize: responsiveText.small }}>
            <Text component="span" fw={600} c={colors.textPrimary}>US Shipping Only:</Text>{" "}
            <Text component="span" c={colors.textSecondary}>
              We can only ship to addresses within the United States.
              International shipping is not available at this time.
            </Text>
          </Text>
        </Group>
      </Box>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Stack gap="md">
          <GlassCard variant="subtle">
            <Stack gap="md">
              <TextInput
                {...register("name")}
                label="Full Name"
                placeholder="John Smith"
                size="md"
                error={errors.name?.message}
                required
                styles={mobileInputStyles}
              />

              <TextInput
                {...register("street")}
                label="Street Address"
                placeholder="123 Main St, Apt 4"
                size="md"
                leftSection={<IconMapPin size={18} />}
                error={errors.street?.message}
                required
                styles={mobileInputStyles}
              />

              <Group grow wrap="wrap" gap="md">
                <TextInput
                  {...register("city")}
                  label="City"
                  placeholder="Los Angeles"
                  size="md"
                  error={errors.city?.message}
                  required
                  styles={mobileInputStyles}
                />

                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <USStateSelect
                      value={(field.value as USState) || null}
                      onChange={(val) => field.onChange(val || "")}
                      error={errors.state?.message}
                      required
                    />
                  )}
                />
              </Group>

              <TextInput
                {...register("zip")}
                label="ZIP Code"
                placeholder="90001"
                size="md"
                error={errors.zip?.message}
                required
                style={{ maxWidth: 150 }}
                styles={mobileInputStyles}
              />
            </Stack>
          </GlassCard>

          <GradientButton
            type="submit"
            size="md"
            rightSection={<IconArrowRight size={18} />}
          >
            Continue to Review
          </GradientButton>
        </Stack>
      </form>
    </Stack>
  );
};

export default ShippingStep;
