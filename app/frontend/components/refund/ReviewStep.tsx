import React from "react";
import {
  Stack,
  Text,
  Group,
  Divider,
  Badge,
  ActionIcon,
} from "@mantine/core";
import {
  IconEdit,
  IconCheck,
  IconTicket,
  IconCash,
  IconPhone,
  IconHeart,
} from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import type {
  PassHolder,
  RefundDecision,
  ZelleInfo,
  RefundFormStep,
} from "../../types/refund";

interface ReviewStepProps {
  passHolder: PassHolder;
  decision: RefundDecision;
  refundAmount: number;
  zelleInfo: ZelleInfo | null;
  finalRefund: number;
  onEdit: (step: RefundFormStep) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const DECISION_LABELS: Record<RefundDecision, string> = {
  full: "Full Refund",
  partial: "Partial Refund",
  waive: "Waived (Donated)",
};

const ReviewStep: React.FC<ReviewStepProps> = ({
  passHolder,
  decision,
  refundAmount,
  zelleInfo,
  finalRefund,
  onEdit,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text
          fw={600}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.sectionTitle }}
        >
          Review Your Request
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.body }}>
          Please review all details before submitting your refund request.
        </Text>
      </Stack>

      {/* Ticket Info */}
      <GlassCard variant="subtle">
        <Group justify="space-between" mb="md" wrap="wrap" gap="xs">
          <Group gap="xs">
            <IconTicket size={18} color={colors.primary} />
            <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
              Ticket Information
            </Text>
          </Group>
          <ActionIcon
            variant="light"
            color="gray"
            onClick={() => onEdit("email")}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Group>
        <Stack gap="xs">
          <Group justify="space-between" wrap="wrap" gap="xs">
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Name</Text>
            <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>{passHolder.name}</Text>
          </Group>
          <Group justify="space-between" wrap="wrap" gap="xs">
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Email</Text>
            <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>{passHolder.email}</Text>
          </Group>
          <Group justify="space-between" wrap="wrap" gap="xs">
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Pass Type</Text>
            <Badge color="orange" variant="light">
              {passHolder.passType.replace("_", " ").toUpperCase()}
            </Badge>
          </Group>
          <Group justify="space-between" wrap="wrap" gap="xs">
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Amount Paid</Text>
            <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>${passHolder.amountPaid.toFixed(2)}</Text>
          </Group>
        </Stack>
      </GlassCard>

      {/* Refund Decision */}
      <GlassCard variant="subtle">
        <Group justify="space-between" mb="md" wrap="wrap" gap="xs">
          <Group gap="xs">
            {decision === "waive" ? (
              <IconHeart size={18} color={colors.success} fill={colors.success} />
            ) : (
              <IconCash size={18} color={colors.primary} />
            )}
            <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
              Refund Decision
            </Text>
          </Group>
          <ActionIcon
            variant="light"
            color="gray"
            onClick={() => onEdit("decision")}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Group>
        <Stack gap="xs">
          <Group justify="space-between" wrap="wrap" gap="xs">
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Decision</Text>
            <Badge
              color={decision === "waive" ? "green" : "orange"}
              variant="light"
            >
              {DECISION_LABELS[decision]}
            </Badge>
          </Group>
          {decision !== "waive" && (
            <Group justify="space-between" wrap="wrap" gap="xs">
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Refund Amount</Text>
              <Text fw={600} c={colors.primary} style={{ fontSize: responsiveText.small }}>
                ${refundAmount.toFixed(2)}
              </Text>
            </Group>
          )}
        </Stack>
      </GlassCard>

      {/* Contact Info (if refund) */}
      {zelleInfo && (
        <GlassCard variant="subtle">
          <Group justify="space-between" mb="md" wrap="wrap" gap="xs">
            <Group gap="xs">
              <IconPhone size={18} color={colors.primary} />
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                Zelle Information
              </Text>
            </Group>
            <ActionIcon
              variant="light"
              color="gray"
              onClick={() => onEdit("contact")}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Group>
          <Stack gap="xs">
            <Group justify="space-between" wrap="wrap" gap="xs">
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Email</Text>
              <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>{zelleInfo.email}</Text>
            </Group>
            <Group justify="space-between" wrap="wrap" gap="xs">
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Phone</Text>
              <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>{zelleInfo.phone}</Text>
            </Group>
          </Stack>
        </GlassCard>
      )}

      {/* Final Summary */}
      <GlassCard variant="accent">
        <Stack gap="sm">
          <Text fw={600} c={colors.textPrimary} ta="center" style={{ fontSize: responsiveText.body }}>
            Final Summary
          </Text>
          <Divider color="rgba(244, 93, 0, 0.15)" />

          {decision === "waive" ? (
            <Group gap="xs" justify="center" py="md" wrap="wrap">
              <IconHeart size={24} color={colors.success} fill={colors.success} />
              <Text fw={600} c={colors.success} style={{ fontSize: responsiveText.large }}>
                Thank you for your generous donation!
              </Text>
            </Group>
          ) : (
            <Group justify="space-between" wrap="wrap" gap="xs">
              <Text fw={600} c={colors.primary} style={{ fontSize: responsiveText.body }}>
                Amount to be Refunded
              </Text>
              <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.sectionTitle }}>
                ${finalRefund.toFixed(2)}
              </Text>
            </Group>
          )}
        </Stack>
      </GlassCard>

      <GradientButton
        size="lg"
        leftSection={<IconCheck size={20} />}
        onClick={onSubmit}
        loading={isSubmitting}
      >
        Submit Refund Request
      </GradientButton>

      <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.small }}>
        By submitting, you confirm that all information provided is accurate.
      </Text>
    </Stack>
  );
};

export default ReviewStep;
