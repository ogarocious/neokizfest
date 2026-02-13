import React from "react";
import { Stack, TextInput, Text, Anchor, Group, Box, Button } from "@mantine/core";
import { router } from "@inertiajs/react";
import {
  IconMail,
  IconAlertCircle,
  IconBrandFacebook,
  IconArrowRight,
  IconSearch,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEmailValidation } from "../../hooks/useApi";
import { GlassCard, GradientButton } from "../shared";
import { colors, responsiveText, mobileInputStyles } from "../../styles/theme";
import type { PassHolder } from "../../types/refund";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailStepProps {
  onValidated: (email: string, passHolder: PassHolder) => void;
  initialEmail?: string;
  onLoadingChange?: (loading: boolean) => void;
}

const EmailStep: React.FC<EmailStepProps> = ({
  onValidated,
  initialEmail = "",
  onLoadingChange,
}) => {
  const { validate, loading, data, reset: resetApi } = useEmailValidation();

  React.useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initialEmail },
  });

  const onSubmit = async (formData: EmailFormData) => {
    resetApi();
    const result = await validate(formData.email);

    if (result.success && result.passHolder) {
      onValidated(formData.email, result.passHolder);
    }
  };

  const showError = data && !data.success;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text
          fw={600}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.body }}
        >
          Let's find your ticket
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
          Enter the email address you used to purchase your festival pass.
        </Text>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            {...register("email")}
            label="Email Address"
            placeholder="your.email@example.com"
            size="sm"
            autoComplete="off"
            leftSection={<IconMail size={16} />}
            error={errors.email?.message}
            styles={{
              label: mobileInputStyles.label,
              input: mobileInputStyles.input,
              error: mobileInputStyles.error,
            }}
          />

          {showError && data.error === "already_submitted" && (
            <Box
              p="sm"
              style={{
                background: "rgba(0, 102, 204, 0.1)",
                border: "1px solid rgba(0, 102, 204, 0.3)",
                borderRadius: 12,
              }}
            >
              <Stack gap="sm">
                <Group gap="xs" wrap="nowrap">
                  <IconAlertCircle
                    size={16}
                    color={colors.info}
                    style={{ flexShrink: 0 }}
                  />
                  <Text
                    fw={600}
                    style={{ fontSize: responsiveText.small }}
                    c={colors.info}
                  >
                    Request Already Submitted
                  </Text>
                </Group>
                <Text
                  style={{ fontSize: responsiveText.small }}
                  c={colors.textSecondary}
                >
                  A refund request has already been submitted for this email.
                  {data.existingConfirmation && (
                    <>
                      {" "}Your confirmation number is{" "}
                      <Text component="span" fw={700} c={colors.textPrimary}>
                        {data.existingConfirmation}
                      </Text>.
                    </>
                  )}
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<IconSearch size={16} />}
                  onClick={() => {
                    const email = getValues("email");
                    const params = new URLSearchParams();
                    if (email) params.set("email", email);
                    if (data.existingConfirmation) params.set("ref", data.existingConfirmation);
                    router.visit(`/status?${params.toString()}`);
                  }}
                  fullWidth
                >
                  Check Your Refund Status
                </Button>
              </Stack>
            </Box>
          )}

          {showError && data.error !== "already_submitted" && (
            <Box
              p="sm"
              style={{
                background:
                  data.error === "chargeback"
                    ? "rgba(220, 38, 38, 0.1)"
                    : "rgba(255, 140, 0, 0.1)",
                border:
                  data.error === "chargeback"
                    ? "1px solid rgba(220, 38, 38, 0.3)"
                    : "1px solid rgba(255, 140, 0, 0.3)",
                borderRadius: 12,
              }}
            >
              <Stack gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <IconAlertCircle
                    size={16}
                    color={data.error === "chargeback" ? "#DC2626" : "#FF8C00"}
                    style={{ flexShrink: 0 }}
                  />
                  <Text
                    fw={600}
                    style={{ fontSize: responsiveText.small }}
                    c={data.error === "chargeback" ? "#DC2626" : "#FF8C00"}
                  >
                    {data.error === "chargeback"
                      ? "Chargeback Detected"
                      : "Email Not Found"}
                  </Text>
                </Group>
                <Text
                  style={{ fontSize: responsiveText.small }}
                  c={colors.textSecondary}
                >
                  {data.errorMessage}
                </Text>

                {(data.error === "not_found" ||
                  data.error === "chargeback") && (
                  <Group gap="xs">
                    <Text
                      style={{ fontSize: responsiveText.xs }}
                      c={colors.textMuted}
                    >
                      Need help?
                    </Text>
                    <Anchor
                      href="https://www.facebook.com/neokizfestival"
                      target="_blank"
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <IconBrandFacebook size={14} color={colors.primary} />
                      <Text
                        style={{ fontSize: responsiveText.xs }}
                        c={colors.primary}
                      >
                        Contact us on Facebook
                      </Text>
                    </Anchor>
                  </Group>
                )}
              </Stack>
            </Box>
          )}

          <GradientButton
            type="submit"
            size="sm"
            rightSection={<IconArrowRight size={16} />}
            loading={loading}
            fullWidth
            mb="xl"
          >
            Find My Ticket
          </GradientButton>
        </Stack>
      </form>

      <GlassCard variant="accent" p="sm">
        <Stack gap="xs">
          <Text
            fw={500}
            c={colors.textPrimary}
            style={{ fontSize: responsiveText.small }}
          >
            Test emails for demo:
          </Text>
          <Text
            c={colors.textMuted}
            style={{ fontSize: responsiveText.xs, lineHeight: 1.6 }}
          >
            <strong style={{ color: colors.primary }}>john@example.com</strong>{" "}
            - Full Pass |{" "}
            <strong style={{ color: colors.primary }}>sarah@example.com</strong>{" "}
            - VIP Pass |{" "}
            <strong style={{ color: colors.primary }}>mike@example.com</strong>{" "}
            - Party Pass |{" "}
            <strong style={{ color: colors.primary }}>emma@example.com</strong>{" "}
            - Workshop Pass
          </Text>
          <Text style={{ fontSize: responsiveText.xs }} c="#ff6b6b">
            <strong>chargeback@example.com</strong> - Blocked
          </Text>
        </Stack>
      </GlassCard>
    </Stack>
  );
};

export default EmailStep;
