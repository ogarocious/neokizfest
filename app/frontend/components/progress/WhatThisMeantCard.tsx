import React from "react";
import { Stack, Text, Title, Group } from "@mantine/core";
import { IconStar, IconHeart } from "@tabler/icons-react";
import { GlassCard } from "../shared";
import { colors, responsiveText } from "../../styles/theme";

interface Props {
  waivedCount: number;
}

const WhatThisMeantCard: React.FC<Props> = ({ waivedCount }) => {
  return (
    <GlassCard
      style={{
        background: "linear-gradient(135deg, rgba(255, 215, 0, 0.04) 0%, rgba(244, 93, 0, 0.06) 100%)",
        border: "1px solid rgba(255, 215, 0, 0.18)",
      }}
    >
      <Stack gap="md">
        <Group gap="xs">
          <IconStar size={18} color="#FFD700" fill="#FFD700" />
          <Title order={4} style={{ color: "#FFD700", fontSize: responsiveText.sectionTitle }}>
            What This Meant
          </Title>
        </Group>

        <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}>
          This has never been done before in the kizomba community. A festival cancellation
          where every pass holder was accounted for, every obligation honored, and the
          receipts are public. Not on faith — on record.
        </Text>

        <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}>
          This wasn't a talking point. It was a commitment that got kept, one confirmation
          number at a time. If you're a festival organizer reading this: this is the standard.
        </Text>

        {waivedCount > 0 && (
          <GlassCard
            p="sm"
            style={{
              background: "rgba(244, 93, 0, 0.07)",
              border: "1px solid rgba(244, 93, 0, 0.2)",
            }}
          >
            <Group gap="xs" wrap="wrap" align="flex-start">
              <IconHeart size={15} color={colors.primary} fill={colors.primary} style={{ marginTop: 2, flexShrink: 0 }} />
              <Stack gap={2}>
                <Text fw={600} c={colors.primary} style={{ fontSize: responsiveText.small }}>
                  {waivedCount} people gave their refund back.
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  That's not nothing. That's what made this possible.
                </Text>
              </Stack>
            </Group>
          </GlassCard>
        )}
      </Stack>
    </GlassCard>
  );
};

export default WhatThisMeantCard;
