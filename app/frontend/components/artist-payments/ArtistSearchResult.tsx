import React, { useState } from "react";
import {
  Stack,
  Group,
  Avatar,
  Text,
  Badge,
  ActionIcon,
  Modal,
  Image,
} from "@mantine/core";
import { IconCheck, IconClock, IconEye } from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard } from "../shared";
import type { Artist, FestivalEdition } from "../../data/artistPaymentsData";

interface ArtistAppearance {
  year: number;
  editionName: string;
  artist: Artist;
}

interface ArtistSearchResultProps {
  artistName: string;
  appearances: ArtistAppearance[];
}

const ArtistSearchResult: React.FC<ArtistSearchResultProps> = ({
  artistName,
  appearances,
}) => {
  const [proofOpen, setProofOpen] = useState<string | null>(null);
  const confirmedCount = appearances.filter((a) => a.artist.confirmed).length;
  const mostRecent = appearances[0];

  return (
    <>
      <GlassCard p="lg">
        <Stack gap="md">
          <Group gap="sm" wrap="nowrap">
            <Avatar
              src={mostRecent?.artist.image}
              size={64}
              radius="md"
              color="orange"
              style={{
                flexShrink: 0,
                border: "2px solid rgba(244, 93, 0, 0.3)",
              }}
            >
              {artistName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </Avatar>
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
              <Text
                fw={700}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.body }}
                truncate
              >
                {artistName}
              </Text>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                {appearances.length} edition{appearances.length !== 1 ? "s" : ""} — {confirmedCount} confirmed
              </Text>
            </Stack>
          </Group>

          <Stack gap={0}>
            {appearances.map((appearance) => (
              <Group
                key={appearance.year}
                gap="sm"
                wrap="nowrap"
                py={8}
                px="xs"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                <Text
                  fw={600}
                  c={colors.primary}
                  style={{
                    fontSize: responsiveText.small,
                    minWidth: 40,
                    flexShrink: 0,
                  }}
                >
                  {appearance.year}
                </Text>

                <Avatar
                  src={appearance.artist.image}
                  size={44}
                  radius="md"
                  color="orange"
                  style={{
                    flexShrink: 0,
                    border: "1px solid rgba(244, 93, 0, 0.2)",
                  }}
                >
                  {artistName.charAt(0)}
                </Avatar>

                <Badge
                  size="sm"
                  variant="light"
                  color={appearance.artist.confirmed ? "green" : "gray"}
                  leftSection={
                    appearance.artist.confirmed ? (
                      <IconCheck size={12} />
                    ) : (
                      <IconClock size={12} />
                    )
                  }
                  style={{
                    background: appearance.artist.confirmed
                      ? "rgba(34, 139, 34, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: appearance.artist.confirmed
                      ? "1px solid rgba(34, 139, 34, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {appearance.artist.confirmed ? "Confirmed" : "Pending"}
                </Badge>

                {appearance.artist.proofImages?.length && (
                  <ActionIcon
                    variant="subtle"
                    color="orange"
                    size="sm"
                    onClick={() => setProofOpen(`${appearance.year}-${artistName}`)}
                    style={{ background: "rgba(244, 93, 0, 0.1)" }}
                  >
                    <IconEye size={14} />
                  </ActionIcon>
                )}
              </Group>
            ))}
          </Stack>
        </Stack>
      </GlassCard>

      {appearances
        .filter((a) => a.artist.proofImages?.length)
        .map((appearance) => (
          <Modal
            key={`${appearance.year}-${artistName}`}
            opened={proofOpen === `${appearance.year}-${artistName}`}
            onClose={() => setProofOpen(null)}
            title={`${artistName} — ${appearance.year} Payment Confirmation`}
            size="lg"
            centered
            styles={{
              header: {
                background: "rgba(30, 30, 30, 0.95)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              },
              title: { color: colors.textPrimary, fontWeight: 600 },
              body: { background: "rgba(30, 30, 30, 0.95)", padding: 16 },
              content: {
                background: "rgba(30, 30, 30, 0.95)",
                border: "1px solid rgba(244, 93, 0, 0.15)",
              },
              close: { color: colors.textMuted },
            }}
          >
            <Stack gap="md">
              {appearance.artist.proofImages!.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Payment proof ${i + 1} for ${artistName} (${appearance.year})`}
                  radius="md"
                  fit="contain"
                />
              ))}
            </Stack>
          </Modal>
        ))}
    </>
  );
};

export function buildArtistSearchResults(
  editions: FestivalEdition[],
  query: string
): { artistName: string; appearances: ArtistAppearance[] }[] {
  const artistMap = new Map<
    string,
    { artistName: string; appearances: ArtistAppearance[] }
  >();

  for (const edition of editions) {
    for (const artist of edition.artists) {
      if (!artist.name.toLowerCase().includes(query.toLowerCase())) continue;

      const key = artist.name.toLowerCase();
      if (!artistMap.has(key)) {
        artistMap.set(key, { artistName: artist.name, appearances: [] });
      }
      artistMap.get(key)!.appearances.push({
        year: edition.year,
        editionName: edition.name,
        artist,
      });
    }
  }

  return Array.from(artistMap.values());
}

export default ArtistSearchResult;
