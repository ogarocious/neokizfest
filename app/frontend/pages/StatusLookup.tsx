import React, { useState, useEffect } from "react";
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
} from "../components/shared";
import { useStatusLookup, isMockMode } from "../hooks/useApi";
import type { StatusLookupResponse } from "../types/refund";
import { colors, responsiveText, mobileInputStyles } from "../styles/theme";

const lookupSchema = z.object({
  confirmationNumber: z
    .string()
    .min(1, "Please enter your confirmation number")
    .regex(/^(RR-\d{4}|NKF-REF-\d+)$/i, "Invalid format (e.g., RR-0001)"),
  email: z.string().email("Please enter a valid email address"),
});

type LookupFormData = z.infer<typeof lookupSchema>;

const DECISION_LABELS: Record<string, { label: string; icon: React.FC<any>; color: string }> = {
  full: { label: "Full Refund", icon: IconCash, color: "orange" },
  partial: { label: "Partial Refund", icon: IconCash, color: "blue" },
  waive: { label: "Waived (Donated)", icon: IconHeart, color: "green" },
};

const StatusLookup: React.FC = () => {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] || "");
  const prefillRef = params.get("ref") || "";

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
      confirmationNumber: prefillRef,
      email: "",
    },
  });

  useEffect(() => {
    if (prefillRef) {
      setValue("confirmationNumber", prefillRef.toUpperCase());
    }
  }, [prefillRef, setValue]);

  const onSubmit = async (data: LookupFormData) => {
    setResult(null);
    const response = await lookup(data.confirmationNumber.toUpperCase(), data.email);
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
    <FarewellLayout>
      <Stack gap="lg" maw={700} mx="auto" px={{ base: "sm", sm: "md" }}>
        <PageHeader
          icon={<IconSearch size={32} color="white" />}
          title="Check Your Status"
          subtitle="Enter your confirmation number and email to see the status of your refund request."
        />

        {/* Mock Mode Indicator */}
        {isMockMode && (
          <GlassCard
            p="sm"
            style={{
              background: "rgba(0, 102, 204, 0.1)",
              border: "1px solid rgba(0, 102, 204, 0.3)",
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <IconAlertCircle size={16} color="#0066CC" style={{ flexShrink: 0 }} />
              <Text style={{ fontSize: responsiveText.small }} c={colors.textSecondary}>
                <strong style={{ color: "#0066CC" }}>Demo:</strong> Try RR-0001 or RR-0002 with any email
              </Text>
            </Group>
          </GlassCard>
        )}

        {/* Lookup Form */}
        <GlassCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                {...register("confirmationNumber")}
                label="Confirmation Number"
                placeholder="RR-0001"
                size="sm"
                leftSection={<IconHash size={16} />}
                error={errors.confirmationNumber?.message}
                styles={{
                  label: mobileInputStyles.label,
                  input: {
                    ...mobileInputStyles.input,
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                  },
                  error: mobileInputStyles.error,
                }}
              />

              <TextInput
                {...register("email")}
                label="Email Address"
                placeholder="your.email@example.com"
                size="sm"
                leftSection={<IconMail size={16} />}
                error={errors.email?.message}
                styles={{
                  label: mobileInputStyles.label,
                  input: mobileInputStyles.input,
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
                We couldn't find a refund request matching that confirmation number
                and email. Please double-check your information.
              </Text>
              <Group gap="xs" mt="xs">
                <Text style={{ fontSize: responsiveText.small }} c={colors.textMuted}>Need help?</Text>
                <GradientButton
                  component="a"
                  href="https://www.facebook.com/NeoKizombaFest"
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

              <Divider color="rgba(255, 255, 255, 0.08)" />

              {/* Decision Info */}
              <Stack gap="sm">
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

                {result.request.decision !== "waive" && (
                  <Group justify="space-between" wrap="wrap" gap="xs">
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                      Refund Amount
                    </Text>
                    <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.large }}>
                      ${result.request.refundAmount.toFixed(2)}
                    </Text>
                  </Group>
                )}
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
              href="https://www.facebook.com/NeoKizombaFest"
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
  );
};

export default StatusLookup;
