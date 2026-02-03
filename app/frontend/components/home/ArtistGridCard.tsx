import { Box, Stack, Text, Badge, Paper, Group } from "@mantine/core";
import type { Artist } from "../../data/artistsData";

interface ArtistGridCardProps {
  artist: Artist;
}

const ArtistGridCard: React.FC<ArtistGridCardProps> = ({ artist }) => {
  return (
    <Paper
      withBorder
      radius="md"
      p={0}
      style={{
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
        transition: "transform 0.3s ease",
      }}
      className="hover:scale-[1.02]"
    >
      <Box
        style={{
          backgroundImage: `url(${artist.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) brightness(0.7)",
          aspectRatio: "4 / 5",
          transition: "filter 0.3s ease",
        }}
        className="hover:brightness-100"
      />

      <Stack
        p="sm"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}
        gap={4}
      >
        <Text size="sm" fw={700} c="white">
          {artist.name}
        </Text>
        <Text size="xs" c="gray.3">
          {artist.city}, {artist.country} {artist.countryFlag}
        </Text>

        <Group gap={4}>
          {artist.isDJ && (
            <Badge size="xs" variant="light" color="orange">
              DJ
            </Badge>
          )}
          {artist.isInstructor && (
            <Badge size="xs" variant="light" color="gray">
              Instructor
            </Badge>
          )}
        </Group>
      </Stack>
    </Paper>
  );
};

export default ArtistGridCard;
