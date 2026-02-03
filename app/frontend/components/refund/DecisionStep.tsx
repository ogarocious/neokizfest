import React, { useState } from "react";
import {
  Stack,
  Text,
  Group,
  NumberInput,
  Radio,
  Box,
} from "@mantine/core";
import {
  IconHeart,
  IconArrowRight,
  IconInfoCircle,
} from "@tabler/icons-react";
import { colors, responsiveText, mobileInputStyles } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import type { RefundDecision, PassHolder } from "../../types/refund";

interface DecisionStepProps {
  passHolder: PassHolder;
  onDecision: (decision: RefundDecision, partialAmount?: number) => void;
}

const DecisionStep: React.FC<DecisionStepProps> = ({
  passHolder,
  onDecision,
}) => {
  const [decision, setDecision] = useState<RefundDecision | null>(null);
  const [partialAmount, setPartialAmount] = useState<number>(Math.floor(passHolder.amountPaid / 2));
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!decision) {
      setError("Please select an option");
      return;
    }

    if (decision === "partial") {
      if (!partialAmount || partialAmount < 1) {
        setError("Please enter a valid refund amount");
        return;
      }
      if (partialAmount > passHolder.amountPaid) {
        setError(`Amount cannot exceed $${passHolder.amountPaid}`);
        return;
      }
    }

    onDecision(decision, decision === "partial" ? partialAmount : undefined);
  };

  return (
    <Stack gap={{ base: "md", sm: "lg" }}>
      <Stack gap="xs">
        <Text
          fw={600}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.sectionTitle }}
        >
          Choose your refund option
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.body }}>
          How would you like to handle your ${passHolder.amountPaid.toFixed(2)} ticket purchase?
        </Text>
      </Stack>

      <Stack gap={{ base: "sm", sm: "md" }}>
        {/* Full Refund Option */}
        <GlassCard
          style={{
            border: `2px solid ${decision === "full" ? colors.primary : "rgba(255, 255, 255, 0.08)"}`,
            background: decision === "full"
              ? "linear-gradient(135deg, rgba(244, 93, 0, 0.12) 0%, rgba(162, 90, 60, 0.16) 100%)"
              : "rgba(255, 255, 255, 0.03)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => {
            setDecision("full");
            setError(null);
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
            <Group gap="md" align="flex-start">
              <Radio
                checked={decision === "full"}
                onChange={() => setDecision("full")}
                styles={{
                  radio: {
                    borderColor: colors.primary,
                    "&:checked": {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  },
                }}
              />
              <Stack gap={4}>
                <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                  Full Refund
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  Receive 100% of your ticket purchase back
                </Text>
              </Stack>
            </Group>
            <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.sectionTitle }}>
              ${passHolder.amountPaid.toFixed(2)}
            </Text>
          </Group>
        </GlassCard>

        {/* Partial Refund Option */}
        <GlassCard
          style={{
            border: `2px solid ${decision === "partial" ? colors.primary : "rgba(255, 255, 255, 0.08)"}`,
            background: decision === "partial"
              ? "linear-gradient(135deg, rgba(244, 93, 0, 0.12) 0%, rgba(162, 90, 60, 0.16) 100%)"
              : "rgba(255, 255, 255, 0.03)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => {
            setDecision("partial");
            setError(null);
          }}
        >
          <Stack gap={{ base: "sm", sm: "md" }}>
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <Group gap="md" align="flex-start">
                <Radio
                  checked={decision === "partial"}
                  onChange={() => setDecision("partial")}
                  styles={{
                    radio: {
                      borderColor: colors.primary,
                      "&:checked": {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    },
                  }}
                />
                <Stack gap={4}>
                  <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                    Partial Refund
                  </Text>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                    Choose a custom amount to receive
                  </Text>
                </Stack>
              </Group>
            </Group>

            {decision === "partial" && (
              <NumberInput
                value={partialAmount}
                onChange={(val) => {
                  setPartialAmount(typeof val === "number" ? val : 0);
                  setError(null);
                }}
                min={1}
                max={passHolder.amountPaid}
                prefix="$"
                size="md"
                styles={{
                  ...mobileInputStyles,
                  input: {
                    ...mobileInputStyles.input,
                    fontWeight: 600,
                    fontSize: responsiveText.large,
                  },
                }}
              />
            )}
          </Stack>
        </GlassCard>

        {/* Waive Refund Option */}
        <GlassCard
          style={{
            border: `2px solid ${decision === "waive" ? colors.success : "rgba(255, 255, 255, 0.08)"}`,
            background: decision === "waive"
              ? "linear-gradient(135deg, rgba(34, 139, 34, 0.12) 0%, rgba(50, 205, 50, 0.16) 100%)"
              : "rgba(255, 255, 255, 0.03)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => {
            setDecision("waive");
            setError(null);
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
            <Group gap="md" align="flex-start">
              <Radio
                checked={decision === "waive"}
                onChange={() => setDecision("waive")}
                styles={{
                  radio: {
                    borderColor: colors.success,
                    "&:checked": {
                      backgroundColor: colors.success,
                      borderColor: colors.success,
                    },
                  },
                }}
              />
              <Stack gap={4}>
                <Group gap="xs">
                  <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                    Waive My Refund
                  </Text>
                  <IconHeart size={18} color={colors.success} fill={colors.success} />
                </Group>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  Donate your ticket value to support the closure process
                </Text>
              </Stack>
            </Group>
            <Text fw={600} c={colors.success} style={{ fontSize: responsiveText.large }}>
              Thank you!
            </Text>
          </Group>
        </GlassCard>
      </Stack>

      {error && (
        <Box
          style={{
            background: "rgba(255, 107, 107, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 107, 107, 0.3)",
            borderRadius: "8px",
            padding: "12px 16px",
          }}
        >
          <Group gap="xs">
            <IconInfoCircle size={18} color={colors.error} />
            <Text c={colors.error} style={{ fontSize: responsiveText.small }}>
              {error}
            </Text>
          </Group>
        </Box>
      )}

      <GradientButton
        size="md"
        rightSection={<IconArrowRight size={18} />}
        onClick={handleContinue}
        disabled={!decision}
      >
        Continue
      </GradientButton>
    </Stack>
  );
};

export default DecisionStep;
