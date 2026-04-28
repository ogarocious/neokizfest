import React from "react";
import { Stack, Text, Group, Badge } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { GlassCard } from "../shared";
import { colors, responsiveText } from "../../styles/theme";

interface Props {
  totalHolders: number;
  animated: boolean;
}

const CompletionHero: React.FC<Props> = ({ totalHolders, animated }) => {
  return (
    <>
      <style>{`
        @keyframes nkfHeroEnter {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nkfHeroGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.12), 0 0 60px rgba(255, 215, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.4); }
          50%       { box-shadow: 0 0 55px rgba(255, 215, 0, 0.22), 0 0 110px rgba(255, 215, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4); }
        }
      `}</style>
      <GlassCard
        p={{ base: "md", sm: "xl" }}
        style={{
          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.06) 0%, rgba(244, 93, 0, 0.08) 50%, rgba(255, 215, 0, 0.05) 100%)",
          border: "1px solid rgba(255, 215, 0, 0.4)",
          opacity: animated ? 0 : 1,
          animation: animated
            ? "nkfHeroEnter 0.9s ease-out forwards, nkfHeroGlow 3.5s ease-in-out 1s infinite"
            : "nkfHeroGlow 3.5s ease-in-out infinite",
        }}
      >
        <Stack gap="md" align="center">
          <Badge
            size="sm"
            style={{
              backgroundColor: "rgba(255, 215, 0, 0.1)",
              border: "1px solid rgba(255, 215, 0, 0.35)",
              color: "#FFD700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "0.6rem",
              fontWeight: 700,
            }}
          >
            Closed · April 2026
          </Badge>

          <Stack gap={2} align="center">
            <Text
              ta="center"
              fw={800}
              style={{
                fontSize: "clamp(1.8rem, 6vw, 3.2rem)",
                color: colors.textPrimary,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
            >
              I told you I would.
            </Text>
            <Text
              ta="center"
              fw={800}
              style={{
                fontSize: "clamp(1.8rem, 6vw, 3.2rem)",
                color: "#FFD700",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
            >
              Here's the proof.
            </Text>
          </Stack>

          <Text
            ta="center"
            c={colors.textSecondary}
            style={{
              fontSize: responsiveText.body,
              maxWidth: 500,
              lineHeight: 1.65,
            }}
          >
            {totalHolders} pass holders. Every single one resolved.
            No exceptions, no excuses — just follow-through.
          </Text>

          <Group gap="xs" align="center">
            <IconCheck size={14} color="#FFD700" />
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
              {totalHolders} for {totalHolders} · Every refund honored
            </Text>
          </Group>
        </Stack>
      </GlassCard>
    </>
  );
};

export default CompletionHero;
