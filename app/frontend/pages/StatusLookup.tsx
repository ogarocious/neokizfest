import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
  Stack,
  Text,
  TextInput,
  Group,
  Divider,
  Badge,
  Timeline,
} from "@mantine/core";
import { usePage } from "@inertiajs/react";
import {
  IconSearch,
  IconMail,
  IconHash,
  IconAlertCircle,
  IconBrandFacebook,
  IconCheck,
  IconLoader,
  IconCash,
  IconHeart,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  PageHeader,
  BackToHome,
  GradientButton,
  StatusBadge,
  LoadingOverlay,
} from "../components/shared";
import { useStatusLookup } from "../hooks/useApi";
import type { StatusLookupResponse } from "../types/refund";
import { colors, responsiveText, mobileInputStyles } from "../styles/theme";

const lookupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  confirmationNumber: z
    .string()
    .min(1, "Please enter your confirmation number")
    .regex(/^(RR-\d{4,}|NKF-REF-\d+)$/i, "Invalid format (e.g., RR-0001)"),
});

type LookupFormData = z.infer<typeof lookupSchema>;

const DECISION_LABELS: Record<string, { label: string; icon: React.FC<any>; color: string }> = {
  full: { label: "Full Refund", icon: IconCash, color: "orange" },
  partial: { label: "Partial Refund", icon: IconCash, color: "blue" },
  waive: { label: "Waived (Donated)", icon: IconHeart, color: "green" },
};

interface StatusLookupProps {
  zelle_paused?: boolean;
}

const StatusLookup: React.FC<StatusLookupProps> = ({ zelle_paused = false }) => {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] || "");
  const prefillRef = params.get("ref") || "";
  const prefillEmail = params.get("email") || "";

  const [result, setResult] = useState<StatusLookupResponse | null>(null);
  const { lookup, loading } = useStatusLookup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LookupFormData>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      email: prefillEmail,
      confirmationNumber: prefillRef || "",
    },
  });

  useEffect(() => {
    if (prefillRef) {
      setValue("confirmationNumber", prefillRef.toUpperCase());
    }
    if (prefillEmail) {
      setValue("email", prefillEmail);
    }
  }, [prefillRef, prefillEmail, setValue]);

  const onSubmit = async (data: LookupFormData) => {
    setResult(null);
    const response = await lookup(data.email, data.confirmationNumber.toUpperCase());
    setResult(response);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head title="Check Status">
        <meta name="description" content="Check the status of your Neo Kizomba Festival refund request." />
        <meta property="og:title" content="Check Status — Neo Kizomba Festival" />
        <meta property="og:description" content="Check the status of your Neo Kizomba Festival refund request." />
      </Head>
      <FarewellLayout>
      <LoadingOverlay visible={loading} message="Looking up your status..." />
      <Stack gap="lg" maw={700} mx="auto" px={{ base: "sm", sm: "md" }}>
        <PageHeader
          icon={<IconSearch size={32} color="white" />}
          title="Check Your Status"
          subtitle="Enter your email and confirmation number to check the status of your refund request."
        />

        {/* Lookup Form */}
        <GlassCard>
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

              <TextInput
                {...register("confirmationNumber")}
                label="Confirmation Number"
                description="Found in your confirmation email"
                placeholder="RR-0001"
                size="sm"
                autoComplete="off"
                leftSection={<IconHash size={16} />}
                error={errors.confirmationNumber?.message}
                styles={{
                  label: mobileInputStyles.label,
                  input: {
                    ...mobileInputStyles.input,
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                  },
                  description: mobileInputStyles.description,
                  error: mobileInputStyles.error,
                }}
              />

              <GradientButton
                type="submit"
                size="sm"
                leftSection={<IconSearch size={16} />}
                loading={loading}
                fullWidth
              >
                Look Up Status
              </GradientButton>
            </Stack>
          </form>
        </GlassCard>

        {/* Error State */}
        {result && !result.success && (
          <GlassCard
            p="md"
            style={{
              background: "rgba(255, 140, 0, 0.1)",
              border: "1px solid rgba(255, 140, 0, 0.3)",
            }}
          >
            <Stack gap="xs">
              <Group gap="xs" wrap="nowrap">
                <IconAlertCircle size={18} color="#FF8C00" style={{ flexShrink: 0 }} />
                <Text fw={600} style={{ fontSize: responsiveText.body }} c={colors.textPrimary}>
                  Request Not Found
                </Text>
              </Group>
              <Text style={{ fontSize: responsiveText.small }} c={colors.textSecondary}>
                We couldn't find a refund request matching that email and
                confirmation number. Please double-check your information.
              </Text>
              <Group gap="xs" mt="xs">
                <Text style={{ fontSize: responsiveText.small }} c={colors.textMuted}>Need help?</Text>
                <GradientButton
                  component="a"
                  href="https://www.facebook.com/neokizfestival"
                  target="_blank"
                  buttonVariant="outline"
                  size="xs"
                  leftSection={<IconBrandFacebook size={14} />}
                >
                  Contact Us
                </GradientButton>
              </Group>
            </Stack>
          </GlassCard>
        )}

        {/* Success State - Results */}
        {result && result.success && result.request && (
          <GlassCard>
            <Stack gap="md">
              {/* Status Header */}
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
                <Stack gap={2}>
                  <Text
                    c={colors.textMuted}
                    tt="uppercase"
                    fw={500}
                    style={{ fontSize: responsiveText.xs }}
                  >
                    Confirmation
                  </Text>
                  <Text
                    fw={700}
                    c={colors.primary}
                    style={{ fontFamily: "monospace", fontSize: responsiveText.body }}
                  >
                    {result.request.confirmationNumber}
                  </Text>
                </Stack>

                <StatusBadge status={result.request.status} size="md" />
              </Group>

              {/* Zelle Paused Notice — shown only for Zelle requests not yet completed */}
              {zelle_paused &&
                result.request.paymentMethod === "zelle" &&
                result.request.status !== "completed" && (
                <GlassCard
                  p="sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 165, 0, 0.14) 100%)",
                    border: "1px solid rgba(255, 165, 0, 0.35)",
                  }}
                >
                  <Group gap="xs" align="flex-start" wrap="nowrap">
                    <IconAlertCircle size={16} color="#FFA500" style={{ flexShrink: 0, marginTop: 2 }} />
                    <Stack gap={4}>
                      <Text fw={600} c="#FFA500" style={{ fontSize: responsiveText.small }}>
                        Zelle Payments Temporarily Paused
                      </Text>
                      <Text c={colors.textSecondary} style={{ fontSize: responsiveText.xs }}>
                        Your refund is confirmed and queued — nothing is lost. Zelle payments resume next month. If you'd like to try processing earlier, send your Wise username, QR code, or Wise tag to the festival{" "}
                        <a
                          href="https://www.facebook.com/neokizfestival"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#FFA500", textDecoration: "underline" }}
                        >
                          Facebook page.
                        </a>
                      </Text>
                    </Stack>
                  </Group>
                </GlassCard>
              )}

              <Divider color="rgba(255, 255, 255, 0.08)" />

              {/* Decision Info */}
              <Stack gap="sm">
                {result.request.decision && DECISION_LABELS[result.request.decision] && (
                  <Group justify="space-between" wrap="wrap" gap="xs">
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                      Decision
                    </Text>
                    {(() => {
                      const config = DECISION_LABELS[result.request.decision];
                      const Icon = config.icon;
                      return (
                        <Badge
                          color={config.color}
                          variant="light"
                          size="md"
                          leftSection={<Icon size={12} />}
                        >
                          {config.label}
                        </Badge>
                      );
                    })()}
                  </Group>
                )}

                {result.request.paymentMethod && (
                  <Group justify="space-between" wrap="wrap" gap="xs">
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                      Payment Method
                    </Text>
                    <Badge
                      size="sm"
                      variant="light"
                      color={result.request.paymentMethod === "wise" ? "teal" : "violet"}
                    >
                      {result.request.paymentMethod === "wise" ? "Wise" : "Zelle"}
                    </Badge>
                  </Group>
                )}

                {result.request.amountPaid != null && (
                  <Group justify="space-between" wrap="wrap" gap="xs">
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                      Original Ticket Amount
                    </Text>
                    <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                      ${result.request.amountPaid.toFixed(2)}
                    </Text>
                  </Group>
                )}

                {result.request.decision !== "waive" && result.request.refundAmount != null && (
                  <Group justify="space-between" wrap="wrap" gap="xs">
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                      Refund Amount
                    </Text>
                    <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.large }}>
                      ${result.request.refundAmount.toFixed(2)}
                    </Text>
                  </Group>
                )}

                {result.request.amountPaid != null && result.request.decision !== "full" && (() => {
                  const refund = result.request.refundAmount ?? 0;
                  const waived = result.request.decision === "waive"
                    ? result.request.amountPaid
                    : result.request.amountPaid - refund;
                  return waived > 0 ? (
                    <Group justify="space-between" wrap="wrap" gap="xs">
                      <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                        Amount Waived
                      </Text>
                      <Text fw={600} c={colors.success} style={{ fontSize: responsiveText.body }}>
                        ${waived.toFixed(2)}
                      </Text>
                    </Group>
                  ) : null;
                })()}
              </Stack>

              <Divider color="rgba(255, 255, 255, 0.08)" />

              {/* Timeline */}
              <Stack gap="xs">
                <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                  Timeline
                </Text>
                <Timeline
                  active={result.request.status === "completed" ? 2 : 1}
                  bulletSize={20}
                  lineWidth={2}
                  color="orange"
                  styles={{
                    itemTitle: {
                      fontSize: responsiveText.small,
                      color: colors.textPrimary,
                    },
                  }}
                >
                  <Timeline.Item
                    bullet={<IconCheck size={12} />}
                    title="Submitted"
                  >
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                      {formatDate(result.request.submittedAt)}
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item
                    bullet={
                      result.request.status === "processing" ? (
                        <IconLoader size={12} />
                      ) : (
                        <IconCheck size={12} />
                      )
                    }
                    title={
                      result.request.status === "processing"
                        ? "Processing"
                        : "Processed"
                    }
                  >
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                      {result.request.status === "processing"
                        ? "In progress..."
                        : "Completed"}
                    </Text>
                  </Timeline.Item>

                  {result.request.completedAt && (
                    <Timeline.Item
                      bullet={<IconCheck size={12} />}
                      title="Completed"
                    >
                      <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                        {formatDate(result.request.completedAt)}
                      </Text>
                    </Timeline.Item>
                  )}
                </Timeline>
              </Stack>

              {result.request.notes && (
                <>
                  <Divider color="rgba(255, 255, 255, 0.08)" />
                  <Stack gap="xs">
                    <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                      Notes
                    </Text>
                    <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small }}>
                      {result.request.notes}
                    </Text>
                  </Stack>
                </>
              )}
            </Stack>
          </GlassCard>
        )}

        {/* Help Section */}
        <GlassCard variant="accent" p={{ base: "sm", sm: "md" }}>
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Stack gap={2}>
              <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                Can't find your request?
              </Text>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                Contact us on Facebook for assistance.
              </Text>
            </Stack>
            <GradientButton
              component="a"
              href="https://www.facebook.com/neokizfestival"
              target="_blank"
              size="xs"
              leftSection={<IconBrandFacebook size={14} />}
            >
              Get Help
            </GradientButton>
          </Group>
        </GlassCard>

        <BackToHome />
      </Stack>
    </FarewellLayout>
    </>
  );
};

export default StatusLookup;
