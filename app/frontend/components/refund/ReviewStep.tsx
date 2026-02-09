import React from "react";
import {
  Stack,
  Text,
  Group,
  Divider,
  Badge,
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  IconEdit,
  IconCheck,
  IconTicket,
  IconCash,
  IconShirt,
  IconPhone,
  IconMapPin,
  IconHeart,
} from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import type {
  PassHolder,
  RefundDecision,
  ShirtOrder,
  ZelleInfo,
  ShippingAddress,
  RefundFormStep,
} from "../../types/refund";
import { SHIRT_SIZES } from "../shared/ShirtSizeSelect";

interface ReviewStepProps {
  passHolder: PassHolder;
  decision: RefundDecision;
  refundAmount: number;
  wantsShirt: boolean;
  shirts: ShirtOrder[];
  shirtTotal: number;
  zelleInfo: ZelleInfo | null;
  shippingAddress: ShippingAddress | null;
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
  wantsShirt,
  shirts,
  shirtTotal,
  zelleInfo,
  shippingAddress,
  finalRefund,
  onEdit,
  onSubmit,
  isSubmitting,
}) => {
  const getSizeLabel = (size: string) => {
    return SHIRT_SIZES.find((s) => s.value === size)?.label || size;
  };

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

      {/* Shirt Order */}
      <GlassCard variant="subtle">
        <Group justify="space-between" mb="md" wrap="wrap" gap="xs">
          <Group gap="xs">
            <IconShirt size={18} color={colors.primary} />
            <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
              Commemorative T-Shirt
            </Text>
          </Group>
          <ActionIcon
            variant="light"
            color="gray"
            onClick={() => onEdit("shirt")}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Group>
        {wantsShirt ? (
          <Stack gap="xs">
            {shirts.map((shirt, index) => (
              <Group key={index} justify="space-between" wrap="wrap" gap="xs">
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  {getSizeLabel(shirt.size)} x {shirt.quantity}
                </Text>
                <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>${(shirt.quantity * 45).toFixed(2)}</Text>
              </Group>
            ))}
            <Divider color="rgba(255, 255, 255, 0.08)" />
            <Group justify="space-between" wrap="wrap" gap="xs">
              <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>Shirt Total</Text>
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>${shirtTotal.toFixed(2)}</Text>
            </Group>
          </Stack>
        ) : (
          <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>No shirt ordered</Text>
        )}
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

      {/* Shipping Address (if shirt) */}
      {shippingAddress && (
        <GlassCard variant="subtle">
          <Group justify="space-between" mb="md" wrap="wrap" gap="xs">
            <Group gap="xs">
              <IconMapPin size={18} color={colors.primary} />
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                Shipping Address
              </Text>
            </Group>
            <ActionIcon
              variant="light"
              color="gray"
              onClick={() => onEdit("shipping")}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Group>
          <Stack gap={4}>
            <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>{shippingAddress.name}</Text>
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>{shippingAddress.street}</Text>
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
            </Text>
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
            <>
              <Group justify="space-between" wrap="wrap" gap="xs">
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Refund Amount</Text>
                <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>${refundAmount.toFixed(2)}</Text>
              </Group>
              {shirtTotal > 0 && (
                <Group justify="space-between" wrap="wrap" gap="xs">
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>Less: T-Shirt Purchase</Text>
                  <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>-${shirtTotal.toFixed(2)}</Text>
                </Group>
              )}
              <Divider color="rgba(244, 93, 0, 0.15)" />
              <Group justify="space-between" wrap="wrap" gap="xs">
                <Text fw={600} c={colors.primary} style={{ fontSize: responsiveText.body }}>
                  Amount to be Refunded
                </Text>
                <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.sectionTitle }}>
                  ${finalRefund.toFixed(2)}
                </Text>
              </Group>
            </>
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
