import React from "react";
import { Stack, Group, Text, Divider } from "@mantine/core";
import { IconMinus, IconEqual, IconHeart } from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard } from "../shared";
import type { RefundDecision } from "../../types/refund";

interface RefundCalculatorProps {
  decision: RefundDecision;
  amountPaid: number;
  refundAmount: number;
  shirtTotal: number;
  finalRefund: number;
}

const RefundCalculator: React.FC<RefundCalculatorProps> = ({
  decision,
  amountPaid,
  refundAmount,
  shirtTotal,
  finalRefund,
}) => {
  const isWaived = decision === "waive";

  return (
    <GlassCard variant="accent">
      <Stack gap="sm">
        <Text
          fw={600}
          c={colors.textMuted}
          tt="uppercase"
          style={{ fontSize: responsiveText.xs }}
        >
          Refund Summary
        </Text>

        {isWaived ? (
          <Group gap="xs" justify="center" py="md" wrap="wrap">
            <IconHeart size={24} color={colors.success} fill={colors.success} />
            <Text fw={600} c={colors.success} style={{ fontSize: responsiveText.large }}>
              You are generously waiving your ${amountPaid.toFixed(2)} refund
            </Text>
          </Group>
        ) : (
          <>
            <Group justify="space-between" wrap="wrap" gap="xs">
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                {decision === "full" ? "Full refund amount" : "Partial refund amount"}
              </Text>
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                ${refundAmount.toFixed(2)}
              </Text>
            </Group>

            {shirtTotal > 0 && (
              <>
                <Group justify="space-between" wrap="wrap" gap="xs">
                  <Group gap="xs">
                    <IconMinus size={14} color={colors.textMuted} />
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>T-Shirt purchase</Text>
                  </Group>
                  <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                    ${shirtTotal.toFixed(2)}
                  </Text>
                </Group>

                <Divider color="rgba(244, 93, 0, 0.15)" />

                <Group justify="space-between" wrap="wrap" gap="xs">
                  <Group gap="xs">
                    <IconEqual size={14} color={colors.primary} />
                    <Text fw={600} c={colors.primary} style={{ fontSize: responsiveText.body }}>
                      Your refund
                    </Text>
                  </Group>
                  <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.sectionTitle }}>
                    ${finalRefund.toFixed(2)}
                  </Text>
                </Group>
              </>
            )}

            {shirtTotal === 0 && (
              <Group justify="space-between" wrap="wrap" gap="xs">
                <Text fw={600} c={colors.primary} style={{ fontSize: responsiveText.body }}>
                  Your refund
                </Text>
                <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.sectionTitle }}>
                  ${finalRefund.toFixed(2)}
                </Text>
              </Group>
            )}
          </>
        )}

        {shirtTotal > 0 && finalRefund === 0 && !isWaived && (
          <Text c={colors.textMuted} ta="center" mt="xs" style={{ fontSize: responsiveText.small }}>
            Shirt cost equals or exceeds your refund. No refund payment will be sent.
          </Text>
        )}

        {shirtTotal > refundAmount && !isWaived && (
          <Text c={colors.warning} ta="center" mt="xs" style={{ fontSize: responsiveText.small }}>
            Note: You will need to pay ${(shirtTotal - refundAmount).toFixed(2)} for the shirts separately.
          </Text>
        )}
      </Stack>
    </GlassCard>
  );
};

export default RefundCalculator;
