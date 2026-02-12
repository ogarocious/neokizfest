import React from "react";
import {
  Stack,
  Text,
  Title,
  Group,
  Badge,
  Progress,
  Accordion,
  Image,
  Box,
  SimpleGrid,
} from "@mantine/core";
import { IconCalendar, IconChevronDown } from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard } from "../shared";
import ArtistEntry from "./ArtistEntry";
import ArtistCard from "./ArtistCard";
import type { FestivalEdition } from "../../data/artistPaymentsData";

export type ViewMode = "list" | "gallery";

interface FestivalYearCardProps {
  edition: FestivalEdition;
  defaultExpanded?: boolean;
  searchQuery?: string;
  viewMode?: ViewMode;
}

const FestivalYearCard: React.FC<FestivalYearCardProps> = ({
  edition,
  defaultExpanded = false,
  searchQuery = "",
  viewMode = "list",
}) => {
  const confirmedCount = edition.artists.filter((a) => a.confirmed).length;
  const totalCount = edition.artists.length;
  const percentage = totalCount > 0 ? (confirmedCount / totalCount) * 100 : 0;
  const isFullyConfirmed = confirmedCount === totalCount && totalCount > 0;

  const filteredArtists = searchQuery
    ? edition.artists.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : edition.artists;

  const isCancelled = edition.artists.length === 0;

  if (searchQuery && filteredArtists.length === 0 && !isCancelled) return null;

  return (
    <GlassCard
      p={0}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        opacity: isCancelled ? 0.6 : 1,
      }}
    >
      {/* Flyer image stacks on top when present */}
      {edition.flyerImage && (
        <Box p="md" pb={0}>
          <Image
            src={edition.flyerImage}
            alt={`${edition.name} flyer`}
            radius="md"
            fit="cover"
            w="100%"
          />
        </Box>
      )}

      <Stack gap="sm" p="md" style={{ flex: 1 }}>
        {/* Header: year + badge */}
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <IconCalendar size={16} color={isCancelled ? colors.textDim : colors.primary} style={{ flexShrink: 0 }} />
            <Title
              order={3}
              fw={700}
              c={isCancelled ? colors.textMuted : colors.textPrimary}
              style={{
                fontSize: responsiveText.small,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {edition.name}
            </Title>
          </Group>
          {!isCancelled && (
            <Badge
              size="sm"
              variant="light"
              color={isFullyConfirmed ? "green" : "orange"}
              style={{
                background: isFullyConfirmed
                  ? "rgba(34, 139, 34, 0.15)"
                  : "rgba(244, 93, 0, 0.1)",
                border: isFullyConfirmed
                  ? "1px solid rgba(34, 139, 34, 0.3)"
                  : "1px solid rgba(244, 93, 0, 0.2)",
                flexShrink: 0,
              }}
            >
              {confirmedCount} of {totalCount} Confirmed
            </Badge>
          )}
        </Group>

        {edition.note && (
          <Text
            c={colors.textMuted}
            fs="italic"
            style={{ fontSize: responsiveText.xs }}
          >
            {edition.note}
          </Text>
        )}

        {isCancelled ? (
          <Text c={colors.textDim} style={{ fontSize: responsiveText.xs }}>
            No artists — this edition did not take place.
          </Text>
        ) : (
          <>
            {/* Progress bar */}
            <Stack gap={4}>
              <Progress
                value={percentage}
                size="sm"
                radius="xl"
                color={isFullyConfirmed ? "green" : "orange"}
                styles={{
                  root: { background: "rgba(255, 255, 255, 0.06)" },
                }}
              />
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                {confirmedCount} of {totalCount} confirmed
              </Text>
            </Stack>

            {viewMode === "gallery" ? (
              /* Gallery view — artist image cards in a grid */
              <SimpleGrid cols={{ base: 2, xs: 3 }} spacing="sm">
                {filteredArtists.map((artist, index) => (
                  <ArtistCard key={`${artist.name}-${index}`} artist={artist} />
                ))}
              </SimpleGrid>
            ) : (
              /* List view — accordion with compact rows */
              <Accordion
                variant="separated"
                defaultValue={defaultExpanded ? "artists" : undefined}
                styles={{
                  item: {
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 8,
                  },
                  control: {
                    color: colors.textSecondary,
                    padding: "8px 12px",
                  },
                  content: { padding: "0 8px 8px" },
                  chevron: { color: colors.textMuted },
                }}
              >
                <Accordion.Item value="artists">
                  <Accordion.Control
                    icon={<IconChevronDown size={14} color={colors.textMuted} />}
                  >
                    <Group gap="xs" wrap="nowrap">
                      <Text
                        fw={500}
                        style={{ fontSize: responsiveText.xs }}
                        c={colors.textSecondary}
                      >
                        View Artists
                      </Text>
                      <Badge
                        size="xs"
                        variant="light"
                        color="orange"
                        style={{
                          background: "rgba(244, 93, 0, 0.1)",
                          border: "1px solid rgba(244, 93, 0, 0.2)",
                        }}
                      >
                        {filteredArtists.length}
                      </Badge>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap={0}>
                      {filteredArtists.map((artist, index) => (
                        <ArtistEntry key={`${artist.name}-${index}`} artist={artist} />
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}
          </>
        )}
      </Stack>
    </GlassCard>
  );
};

export default FestivalYearCard;
