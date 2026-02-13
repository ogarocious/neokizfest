import React, { useState, useMemo } from "react";
import { Stack, Text, Title, Group, TextInput, Progress, SimpleGrid, SegmentedControl, Box } from "@mantine/core";
import { IconMusic, IconSearch, IconUsers, IconQuote, IconList, IconGridDots } from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { GlassCard, PageHeader, BackToHome } from "../components/shared";
import FestivalYearCard, { type ViewMode } from "../components/artist-payments/FestivalYearCard";
import ArtistSearchResult, {
  buildArtistSearchResults,
} from "../components/artist-payments/ArtistSearchResult";
import ArtistTestimonialCard from "../components/artist-payments/ArtistTestimonialCard";
import { festivalEditions, artistTestimonials } from "../data/artistPaymentsData";
import { colors, responsiveText, mobileInputStyles } from "../styles/theme";

const ArtistPayments: React.FC = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const isSearching = search.trim().length > 0;

  const totalArtists = useMemo(
    () => festivalEditions.reduce((sum, e) => sum + e.artists.length, 0),
    []
  );

  const totalConfirmed = useMemo(
    () =>
      festivalEditions.reduce(
        (sum, e) => sum + e.artists.filter((a) => a.confirmed).length,
        0
      ),
    []
  );

  const editionsFullyConfirmed = useMemo(
    () =>
      festivalEditions.filter(
        (e) =>
          e.artists.length > 0 && e.artists.every((a) => a.confirmed)
      ).length,
    []
  );

  const overallPercentage =
    totalArtists > 0 ? (totalConfirmed / totalArtists) * 100 : 0;

  const searchResults = useMemo(
    () => (isSearching ? buildArtistSearchResults(festivalEditions, search.trim()) : []),
    [search, isSearching]
  );

  return (
    <FarewellLayout>
      <Stack
        gap="xl"
        maw={1200}
        mx="auto"
        px={{ base: "sm", sm: "md" }}
        style={{ maxWidth: "100%" }}
      >
        <PageHeader
          icon={<IconMusic size={36} color="white" />}
          title="Artist Payments"
          subtitle="Full transparency on artist payments across every edition of the Neo Kizomba Festival. Artists are being contacted to confirm they were paid."
        />

        {/* Overall Stats */}
        <GlassCard variant="accent" p={{ base: "md", sm: "xl" }}>
          <Stack gap="md">
            <Group justify="space-between" wrap="wrap">
              <Stack gap={2}>
                <Title
                  order={3}
                  fw={700}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.body }}
                >
                  Overall Confirmation Progress
                </Title>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  {editionsFullyConfirmed} of{" "}
                  {festivalEditions.filter((e) => e.artists.length > 0).length} editions
                  fully confirmed
                </Text>
              </Stack>
              <Group gap="lg">
                <Stack gap={0} align="center">
                  <Text
                    fw={700}
                    c={colors.primary}
                    style={{ fontSize: responsiveText.sectionTitle }}
                  >
                    {totalConfirmed}
                  </Text>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                    Confirmed
                  </Text>
                </Stack>
                <Stack gap={0} align="center">
                  <Text
                    fw={700}
                    c={colors.textPrimary}
                    style={{ fontSize: responsiveText.sectionTitle }}
                  >
                    {totalArtists}
                  </Text>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                    Total
                  </Text>
                </Stack>
              </Group>
            </Group>
            <Progress
              value={overallPercentage}
              size="md"
              radius="xl"
              color={overallPercentage === 100 ? "green" : "orange"}
              styles={{
                root: { background: "rgba(255, 255, 255, 0.06)" },
              }}
            />
          </Stack>
        </GlassCard>

        {/* Artist Testimonials */}
        {artistTestimonials.length > 0 && (
          <Stack gap="md">
            <Group gap="xs" justify="center">
              <IconQuote size={20} color={colors.primary} />
              <Title
                order={2}
                fw={700}
                c={colors.textPrimary}
                ta="center"
                style={{ fontSize: responsiveText.sectionTitle }}
              >
                What the Artists Say
              </Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {artistTestimonials.map((testimonial) => (
                <ArtistTestimonialCard
                  key={testimonial.name}
                  testimonial={testimonial}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}

        {/* Search + View Toggle */}
        <Group gap="sm" wrap="nowrap" align="flex-end">
          <TextInput
            placeholder="Search by artist name..."
            leftSection={<IconSearch size={16} color={colors.textMuted} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
            styles={{
              input: {
                ...mobileInputStyles.input,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              },
            }}
          />
          <SegmentedControl
            value={viewMode}
            onChange={(val) => setViewMode(val as ViewMode)}
            data={[
              {
                value: "list",
                label: (
                  <Box style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <IconList size={16} />
                  </Box>
                ),
              },
              {
                value: "gallery",
                label: (
                  <Box style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <IconGridDots size={16} />
                  </Box>
                ),
              },
            ]}
            styles={{
              root: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                flexShrink: 0,
              },
              indicator: {
                background: "rgba(244, 93, 0, 0.2)",
                border: "1px solid rgba(244, 93, 0, 0.3)",
              },
              label: {
                color: colors.textMuted,
                padding: "6px 10px",
              },
            }}
          />
        </Group>

        {/* Content: Search results OR year-by-year browse */}
        {isSearching ? (
          <Stack gap="md">
            {searchResults.length > 0 ? (
              <>
                <Group gap="xs">
                  <IconUsers size={16} color={colors.textMuted} />
                  <Text
                    c={colors.textMuted}
                    style={{ fontSize: responsiveText.small }}
                  >
                    {searchResults.length} artist{searchResults.length !== 1 ? "s" : ""} found
                  </Text>
                </Group>
                {searchResults.map((result) => (
                  <ArtistSearchResult
                    key={result.artistName}
                    artistName={result.artistName}
                    appearances={result.appearances}
                  />
                ))}
              </>
            ) : (
              <GlassCard variant="subtle" p="xl">
                <Stack align="center" gap="xs">
                  <IconSearch size={32} color={colors.textDim} />
                  <Text
                    c={colors.textMuted}
                    ta="center"
                    style={{ fontSize: responsiveText.body }}
                  >
                    No artists found matching "{search}"
                  </Text>
                </Stack>
              </GlassCard>
            )}
          </Stack>
        ) : (
          <SimpleGrid cols={{ base: 1, md: viewMode === "list" ? 2 : 1 }} spacing="md">
            {festivalEditions.map((edition) => (
              <FestivalYearCard key={edition.name} edition={edition} viewMode={viewMode} />
            ))}
          </SimpleGrid>
        )}

        <BackToHome />
      </Stack>
    </FarewellLayout>
  );
};

export default ArtistPayments;
