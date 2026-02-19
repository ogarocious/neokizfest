import React from "react";
import { Stack, Text, Group, Badge, Image, Avatar, Box } from "@mantine/core";
import {
  IconAlignLeft,
  IconPhoto,
  IconMusic,
  IconVideo,
  IconHeart,
  IconCash,
  IconStar,
} from "@tabler/icons-react";
import GlassCard from "../shared/GlassCard";
import { colors, responsiveText } from "../../styles/theme";
import type { FlowerEntry } from "../../types/flowers";

interface FlowerCardProps {
  flower: FlowerEntry;
}

const sourceBadge = (source: string, donated?: boolean) => {
  // Triple recognition: waived refund + donated + left community feedback
  if ((source === "community_waive" || source === "community_donation") && donated) {
    return { label: "Above & Beyond", color: "yellow", icon: <IconStar size={12} fill="#FFD700" color="#FFD700" /> };
  }
  switch (source) {
    case "artist":
      return { label: "Artist", color: "violet", icon: <IconMusic size={12} /> };
    case "community_waive":
      return { label: "Waived Refund", color: "orange", icon: <IconHeart size={12} /> };
    case "community_donation":
      return { label: "Donor", color: "green", icon: <IconCash size={12} /> };
    case "community_refund":
      return { label: "Pass Holder", color: "gray", icon: <IconHeart size={12} /> };
    case "curated":
      return { label: "Curated", color: "blue", icon: <IconPhoto size={12} /> };
    default:
      return { label: "Community", color: "orange", icon: <IconAlignLeft size={12} /> };
  }
};

const FlowerCard: React.FC<FlowerCardProps> = ({ flower }) => {
  const badge = sourceBadge(flower.source, flower.donated);

  return (
    <GlassCard p="md">
      <Stack gap="sm">
        {/* Artist photo */}
        {flower.source === "artist" && flower.imageUrl && (
          <Group gap="sm" align="center">
            <Avatar src={flower.imageUrl} size={40} radius="xl" />
            <Stack gap={2}>
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                {flower.displayName}
              </Text>
              {flower.role && (
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  {flower.role}
                </Text>
              )}
            </Stack>
          </Group>
        )}

        {/* Image content */}
        {flower.contentType === "image" && flower.mediaUrl && (
          <Image
            src={flower.mediaUrl}
            alt={`Shared by ${flower.displayName}`}
            radius="md"
            fit="contain"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 8,
            }}
          />
        )}

        {/* Audio content */}
        {flower.contentType === "audio" && flower.mediaUrl && (
          <Box
            p="sm"
            style={{
              background: "rgba(20, 20, 20, 0.6)",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <audio controls src={flower.mediaUrl} style={{ width: "100%" }} />
          </Box>
        )}

        {/* Video content */}
        {flower.contentType === "video" && flower.mediaUrl && (
          <video
            controls
            src={flower.mediaUrl}
            style={{
              width: "100%",
              maxHeight: 300,
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          />
        )}

        {/* Text message */}
        {flower.message && (
          <Text
            c={colors.textPrimary}
            lh={1.7}
            style={{
              fontSize: responsiveText.small,
              whiteSpace: "pre-wrap",
            }}
          >
            &ldquo;{flower.message}&rdquo;
          </Text>
        )}

        {/* Footer: name + badge */}
        <Group justify="space-between" align="center">
          {flower.source !== "artist" && (
            <Text fw={600} c={colors.primary} style={{ fontSize: responsiveText.small }}>
              — {flower.displayName}
            </Text>
          )}
          {flower.source === "artist" && <span />}
          <Badge
            size="xs"
            variant="light"
            color={badge.color}
            leftSection={badge.icon}
            style={(flower.source === "community_waive" || flower.source === "community_donation") && flower.donated ? {
              backgroundColor: "rgba(255, 215, 0, 0.15)",
              color: "#FFD700",
              border: "1px solid rgba(255, 215, 0, 0.35)",
              fontWeight: 700,
            } : undefined}
          >
            {badge.label}
          </Badge>
        </Group>
      </Stack>
    </GlassCard>
  );
};

export default FlowerCard;
