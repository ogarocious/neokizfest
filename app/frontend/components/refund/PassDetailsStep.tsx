import React from "react";
import { Stack, Text, Group, Badge, Divider, SimpleGrid } from "@mantine/core";
import {
  IconTicket,
  IconCalendar,
  IconCurrencyDollar,
  IconArrowRight,
  IconHash,
} from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import type { PassHolder, PassType } from "../../types/refund";

interface PassDetailsStepProps {
  passHolder: PassHolder;
  onConfirm: () => void;
}

const PASS_TYPE_LABELS: Record<PassType, { label: string; color: string }> = {
  full_pass: { label: "Full Pass", color: "orange" },
  party_pass: { label: "Party Pass", color: "grape" },
  workshop_pass: { label: "Workshop Pass", color: "blue" },
  vip_pass: { label: "VIP Pass", color: "yellow" },
  artist_pass: { label: "Artist Pass", color: "pink" },
};

const PassDetailsStep: React.FC<PassDetailsStepProps> = ({
  passHolder,
  onConfirm,
}) => {
  const passConfig = PASS_TYPE_LABELS[passHolder.passType] ?? {
    label: "Pass",
    color: "gray",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
          We found your ticket!
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
          Please verify these details are correct before continuing.
        </Text>
      </Stack>

      <GlassCard variant="accent" p="md" pb="lg">
        <Stack gap="md">
          {/* Header: Name + Badge */}
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
            <Stack gap={2}>
              <Text
                c={colors.textMuted}
                tt="uppercase"
                fw={500}
                style={{ fontSize: responsiveText.xs, letterSpacing: "0.05em" }}
              >
                Ticket Holder
              </Text>
              <Text
                fw={600}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.body }}
              >
                {passHolder.name}
              </Text>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                {passHolder.email}
              </Text>
            </Stack>

            <Badge
              size="md"
              color={passConfig.color}
              variant="light"
              leftSection={<IconTicket size={12} />}
              style={{ fontSize: responsiveText.xs }}
            >
              {passConfig.label}
            </Badge>
          </Group>

          <Divider color="rgba(244, 93, 0, 0.15)" />

          {/* Details Grid - 2 columns */}
          <SimpleGrid cols={2} spacing="md">
            <Stack gap={2}>
              <Group gap={4}>
                <IconCurrencyDollar size={12} color={colors.textMuted} />
                <Text
                  c={colors.textMuted}
                  tt="uppercase"
                  fw={500}
                  style={{ fontSize: responsiveText.xs, letterSpacing: "0.05em" }}
                >
                  Amount Paid
                </Text>
              </Group>
              <Text
                fw={700}
                c={colors.primary}
                style={{ fontSize: responsiveText.large }}
              >
                ${passHolder.amountPaid.toFixed(2)}
              </Text>
            </Stack>

            <Stack gap={2}>
              <Group gap={4}>
                <IconCalendar size={12} color={colors.textMuted} />
                <Text
                  c={colors.textMuted}
                  tt="uppercase"
                  fw={500}
                  style={{ fontSize: responsiveText.xs, letterSpacing: "0.05em" }}
                >
                  Purchase Date
                </Text>
              </Group>
              <Text
                fw={500}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.body }}
              >
                {formatDate(passHolder.purchaseDate)}
              </Text>
            </Stack>
          </SimpleGrid>

          {/* Confirmation number on its own row */}
          {passHolder.confirmationNumber && (
            <Stack gap={2}>
              <Group gap={4}>
                <IconHash size={12} color={colors.textMuted} />
                <Text
                  c={colors.textMuted}
                  tt="uppercase"
                  fw={500}
                  style={{ fontSize: responsiveText.xs, letterSpacing: "0.05em" }}
                >
                  Original Confirmation
                </Text>
              </Group>
              <Text
                fw={500}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.small, fontFamily: "monospace" }}
              >
                {passHolder.confirmationNumber}
              </Text>
            </Stack>
          )}
        </Stack>
      </GlassCard>

      <GradientButton
        size="sm"
        rightSection={<IconArrowRight size={16} />}
        onClick={onConfirm}
        fullWidth
        mb="sm"
      >
        This is Correct - Continue
      </GradientButton>

      <Text
        c={colors.textMuted}
        ta="center"
        style={{ fontSize: responsiveText.small }}
      >
        Not your ticket? Go back and try a different email address.
      </Text>
    </Stack>
  );
};

export default PassDetailsStep;
