import {
  Paper,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Collapse,
  Box,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { Artist } from "../../data/artistsData";

interface ArtistCardProps {
  artist: Artist;
  expandedArtistId: number | null;
  setExpandedArtistId: (id: number | null) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  expandedArtistId,
  setExpandedArtistId,
}) => {
  const isExpanded = expandedArtistId === artist.id;

  return (
    <Paper
      radius="md"
      withBorder
      p="md"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245,240,235,0.6))",
        transition: "all 0.3s ease",
      }}
    >
      <Stack gap="xs">
        <Box
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "0.5rem",
            aspectRatio: "4 / 3",
          }}
        >
          <img
            src={artist.image}
            alt={artist.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Group justify="space-between" align="flex-start" mt="xs">
          <Stack gap={2} style={{ flex: 1 }}>
            <Text fw={700} size="md" c="#111">
              {artist.name}
            </Text>
            <Text size="xs" c="#555">
              {artist.city}, {artist.country} {artist.countryFlag}
            </Text>
          </Stack>

          <Group gap={4}>
            {artist.isDJ && (
              <Badge size="xs" variant="light" color="orange">
                DJ
              </Badge>
            )}
            {artist.isInstructor && (
              <Badge size="xs" variant="light" color="brown">
                Instructor
              </Badge>
            )}
          </Group>
        </Group>

        <Group gap="xs" justify="center" align="center">
          <Text size="xs" fw={700} c="orange">
            {artist.previousEditions === 1
              ? "1st Time Artist"
              : `${artist.previousEditions}${
                  artist.previousEditions === 2
                    ? "nd"
                    : artist.previousEditions === 3
                    ? "rd"
                    : "th"
                } Time Artist`}
          </Text>
          <Text size="xs" c="#666">
            {artist.participatedYears?.length > 0
              ? artist.participatedYears.join(", ")
              : "First time participant"}
          </Text>
        </Group>

        <Button
          size="xs"
          variant="light"
          rightSection={
            isExpanded ? (
              <IconChevronUp size={14} />
            ) : (
              <IconChevronDown size={14} />
            )
          }
          onClick={() => setExpandedArtistId(isExpanded ? null : artist.id)}
        >
          {isExpanded ? "Hide Bio" : "Read Bio"}
        </Button>

        <Collapse in={isExpanded}>
          <Text size="sm" c="#333" mt="sm">
            {artist.bio}
          </Text>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default ArtistCard;
