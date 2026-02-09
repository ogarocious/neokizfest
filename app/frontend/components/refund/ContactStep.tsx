import React from "react";
import { Stack, Text, TextInput, Box, Group } from "@mantine/core";
import {
  IconPhone,
  IconMail,
  IconArrowRight,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { colors, responsiveText, mobileInputStyles } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import type { ZelleInfo } from "../../types/refund";

const zelleSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s\-()]+$/, "Please enter a valid phone number"),
});

type ZelleFormData = z.infer<typeof zelleSchema>;

interface ContactStepProps {
  onSubmit: (zelleInfo: ZelleInfo) => void;
  initialData?: ZelleInfo | null;
}

const ContactStep: React.FC<ContactStepProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZelleFormData>({
    resolver: zodResolver(zelleSchema),
    defaultValues: initialData || { email: "", phone: "" },
  });

  const onFormSubmit = (data: ZelleFormData) => {
    onSubmit({
      email: data.email,
      phone: data.phone,
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
          Refund Payment Details
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.body }}>
          We'll send your refund via Zelle. Please provide your Zelle contact information.
        </Text>
      </Stack>

      <Box
        style={{
          background: "rgba(0, 102, 204, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 102, 204, 0.3)",
          borderRadius: "8px",
          padding: "12px 16px",
        }}
      >
        <Group gap="xs" align="flex-start">
          <IconInfoCircle size={18} color={colors.info} style={{ marginTop: 2, flexShrink: 0 }} />
          <Text style={{ fontSize: responsiveText.small }}>
            <Text component="span" fw={600} c={colors.textPrimary}>Why Zelle?</Text>{" "}
            <Text component="span" c={colors.textSecondary}>
              Zelle allows us to send refunds quickly and securely
              with no fees. Both the email and phone number must be registered with your Zelle account.
            </Text>
          </Text>
        </Group>
      </Box>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Stack gap="md">
          <GlassCard variant="subtle">
            <Stack gap="md">
              <TextInput
                {...register("email")}
                label="Zelle Email"
                placeholder="your.zelle@email.com"
                description="The email address registered with your Zelle account"
                size="md"
                leftSection={<IconMail size={18} />}
                error={errors.email?.message}
                required
                styles={mobileInputStyles}
              />

              <TextInput
                {...register("phone")}
                label="Zelle Phone Number"
                placeholder="(555) 123-4567"
                description="The phone number registered with your Zelle account"
                size="md"
                leftSection={<IconPhone size={18} />}
                error={errors.phone?.message}
                required
                styles={mobileInputStyles}
              />
            </Stack>
          </GlassCard>

          <GradientButton
            type="submit"
            size="md"
            rightSection={<IconArrowRight size={18} />}
          >
            Continue
          </GradientButton>
        </Stack>
      </form>
    </Stack>
  );
};

export default ContactStep;
