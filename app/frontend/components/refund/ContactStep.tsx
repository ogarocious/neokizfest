import React, { useState } from "react";
import { Stack, Text, TextInput, Box, Group, Radio } from "@mantine/core";
import {
  IconPhone,
  IconMail,
  IconArrowRight,
  IconInfoCircle,
  IconBuildingBank,
  IconCurrencyDollar,
  IconWorld,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { colors, responsiveText, mobileInputStyles } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import type { PaymentInfo, RefundPaymentMethod } from "../../types/refund";

// Zelle validation: at least one of email or phone required
const zelleSchema = z
  .object({
    email: z.string().email("Please enter a valid email address").or(z.literal("")),
    phone: z
      .string()
      .regex(/^[\d\s\-()]*$/, "Please enter a valid phone number"),
  })
  .refine(
    (data) => {
      const hasEmail = data.email.length > 0;
      const hasPhone = data.phone.replace(/[\s\-()]/g, "").length >= 10;
      return hasEmail || hasPhone;
    },
    {
      message: "Please provide either an email or phone number for Zelle",
      path: ["email"],
    }
  );

// Wise validation: email required
const wiseSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface ContactStepProps {
  onSubmit: (paymentInfo: PaymentInfo) => void;
  initialMethod?: RefundPaymentMethod | null;
}

const ContactStep: React.FC<ContactStepProps> = ({ onSubmit, initialMethod }) => {
  const [method, setMethod] = useState<RefundPaymentMethod | null>(initialMethod || null);

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text
          fw={600}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.sectionTitle }}
        >
          Refund Payment Method
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.body }}>
          How would you like to receive your refund?
        </Text>
      </Stack>

      <Stack gap="md">
        {/* Zelle Option */}
        <GlassCard
          style={{
            border: `2px solid ${method === "zelle" ? colors.primary : "rgba(255, 255, 255, 0.08)"}`,
            background:
              method === "zelle"
                ? "linear-gradient(135deg, rgba(244, 93, 0, 0.12) 0%, rgba(162, 90, 60, 0.16) 100%)"
                : "rgba(255, 255, 255, 0.03)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => setMethod("zelle")}
        >
          <Group gap="md" align="flex-start">
            <Radio
              checked={method === "zelle"}
              onChange={() => setMethod("zelle")}
              color="orange"
            />
            <Stack gap={4} style={{ flex: 1 }}>
              <Group gap="xs">
                <IconCurrencyDollar size={18} color={colors.primary} />
                <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                  Zelle
                </Text>
              </Group>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                Fast, free transfers for US bank accounts. Provide your Zelle email or phone number.
              </Text>
            </Stack>
          </Group>
        </GlassCard>

        {/* Wise Option */}
        <GlassCard
          style={{
            border: `2px solid ${method === "wise" ? "#9FE870" : "rgba(255, 255, 255, 0.08)"}`,
            background:
              method === "wise"
                ? "linear-gradient(135deg, rgba(159, 232, 112, 0.12) 0%, rgba(55, 120, 30, 0.16) 100%)"
                : "rgba(255, 255, 255, 0.03)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => setMethod("wise")}
        >
          <Group gap="md" align="flex-start">
            <Radio
              checked={method === "wise"}
              onChange={() => setMethod("wise")}
              color="green"
            />
            <Stack gap={4} style={{ flex: 1 }}>
              <Group gap="xs">
                <IconWorld size={18} color="#9FE870" />
                <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                  Wise
                </Text>
              </Group>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                International transfers with low fees. Great for recipients outside the US (Canada, Europe, etc.).
              </Text>
            </Stack>
          </Group>
        </GlassCard>
      </Stack>

      {/* Show the appropriate form once a method is selected */}
      {method === "zelle" && <ZelleForm onSubmit={onSubmit} />}
      {method === "wise" && <WiseForm onSubmit={onSubmit} />}
    </Stack>
  );
};

// ── Zelle Form ──────────────────────────────────────────

const ZelleForm: React.FC<{ onSubmit: (info: PaymentInfo) => void }> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof zelleSchema>>({
    resolver: zodResolver(zelleSchema),
    defaultValues: { email: "", phone: "" },
  });

  const onFormSubmit = (data: z.infer<typeof zelleSchema>) => {
    onSubmit({
      method: "zelle",
      zelle: {
        email: data.email || undefined,
        phone: data.phone || undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack gap="md">
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
              <Text component="span" c={colors.textSecondary}>
                Provide either the email or phone number registered with your Zelle account.
              </Text>
            </Text>
          </Group>
        </Box>

        <GlassCard variant="subtle">
          <Stack gap="md">
            <TextInput
              {...register("email")}
              label="Zelle Email"
              placeholder="your.zelle@email.com"
              description="The email address registered with your Zelle account"
              size="md"
              autoComplete="off"
              leftSection={<IconMail size={18} />}
              error={errors.email?.message}
              styles={mobileInputStyles}
            />

            <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.small }}>
              — or —
            </Text>

            <TextInput
              {...register("phone")}
              label="Zelle Phone Number"
              placeholder="(555) 123-4567"
              description="The phone number registered with your Zelle account"
              size="md"
              autoComplete="off"
              leftSection={<IconPhone size={18} />}
              error={errors.phone?.message}
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
  );
};

// ── Wise Form ──────────────────────────────────────────

const WiseForm: React.FC<{ onSubmit: (info: PaymentInfo) => void }> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof wiseSchema>>({
    resolver: zodResolver(wiseSchema),
    defaultValues: { email: "" },
  });

  const onFormSubmit = (data: z.infer<typeof wiseSchema>) => {
    onSubmit({
      method: "wise",
      wise: { email: data.email },
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack gap="md">
        <Box
          style={{
            background: "rgba(159, 232, 112, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(159, 232, 112, 0.3)",
            borderRadius: "8px",
            padding: "12px 16px",
          }}
        >
          <Group gap="xs" align="flex-start">
            <IconInfoCircle size={18} color="#9FE870" style={{ marginTop: 2, flexShrink: 0 }} />
            <Text style={{ fontSize: responsiveText.small }}>
              <Text component="span" c={colors.textSecondary}>
                We'll send your refund to this email via Wise. You'll receive an email
                to claim the transfer and provide your bank details.
              </Text>
            </Text>
          </Group>
        </Box>

        <GlassCard variant="subtle">
          <TextInput
            {...register("email")}
            label="Email Address"
            placeholder="your@email.com"
            description="We'll send the Wise transfer to this email"
            size="md"
            autoComplete="off"
            leftSection={<IconMail size={18} />}
            error={errors.email?.message}
            required
            styles={mobileInputStyles}
          />
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
  );
};

export default ContactStep;
