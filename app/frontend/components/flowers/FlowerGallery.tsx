import React, { useState, useMemo } from "react";
import { Stack, Text, Box } from "@mantine/core";
import ContentTypeFilter from "./ContentTypeFilter";
import FlowerCard from "./FlowerCard";
import { colors, responsiveText } from "../../styles/theme";
import type { FlowerEntry, FlowerFilter } from "../../types/flowers";

interface FlowerGalleryProps {
  flowers: FlowerEntry[];
}

const matchesFilter = (flower: FlowerEntry, filter: FlowerFilter): boolean => {
  switch (filter) {
    case "all":
      return true;
    case "artist":
      return flower.source === "artist";
    case "community":
      return flower.source.startsWith("community_");
    case "text":
      return flower.contentType === "text" && !flower.source.startsWith("community_") && flower.source !== "artist";
    case "image":
      return flower.contentType === "image";
    case "audio":
      return flower.contentType === "audio";
    case "video":
      return flower.contentType === "video";
    default:
      return true;
  }
};

const FlowerGallery: React.FC<FlowerGalleryProps> = ({ flowers }) => {
  const [filter, setFilter] = useState<FlowerFilter>("all");

  const counts = useMemo(() => {
    const c: Record<FlowerFilter, number> = { all: flowers.length, text: 0, image: 0, audio: 0, video: 0, artist: 0, community: 0 };
    for (const f of flowers) {
      if (f.source === "artist") c.artist++;
      else if (f.source.startsWith("community_")) c.community++;
      else if (f.contentType === "image") c.image++;
      else if (f.contentType === "audio") c.audio++;
      else if (f.contentType === "video") c.video++;
      else if (f.contentType === "text") c.text++;
    }
    return c;
  }, [flowers]);

  const filtered = useMemo(() => {
    return flowers.filter((f) => matchesFilter(f, filter));
  }, [flowers, filter]);

  if (flowers.length === 0) {
    return (
      <Stack align="center" gap="sm" py="xl">
        <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.body }}>
          The garden is waiting for its first flower.
        </Text>
        <Text c={colors.textDim} ta="center" style={{ fontSize: responsiveText.small }}>
          Be the first to share a memory below!
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <ContentTypeFilter active={filter} onChange={setFilter} counts={counts} />

      {filtered.length === 0 ? (
        <Text c={colors.textMuted} ta="center" py="lg">
          No flowers in this category yet.
        </Text>
      ) : (
        <Box className="masonry-grid">
          <style>{`
            .masonry-grid { columns: 1; column-gap: 16px; }
            @media (min-width: 48em) { .masonry-grid { columns: 2; } }
          `}</style>
          {filtered.map((flower) => (
            <Box
              key={flower.id}
              style={{ breakInside: "avoid", marginBottom: 16 }}
            >
              <FlowerCard flower={flower} />
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  );
};

export default FlowerGallery;
