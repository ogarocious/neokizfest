import { Paper, Stack, Title, Text, Grid } from "@mantine/core";
import ArtistGridCard from "../../components/home/ArtistGridCard";
import { sampleArtists, type Artist } from "../../data/artistsData";

interface FeaturedArtistsProps {
  featured_artists?: Artist[]; // Optional, will fallback to sample
}

const FeaturedArtistsSection: React.FC<FeaturedArtistsProps> = ({
  featured_artists,
}) => {
  // Use sampleArtists if no featured_artists are passed
  const artists = featured_artists?.length ? featured_artists : sampleArtists;
  return (
    <Paper
      py="xl"
      px="lg"
      style={{
        background:
          "linear-gradient(180deg, rgba(162, 90, 60, 0.85) 0%, rgba(199, 172, 164, 0.9) 100%)",
        backdropFilter: "blur(12px)",
        border: "none",
      }}
      radius={0}
    >
      <Stack align="center" gap="xl" maw="80rem" mx="auto">
        {/* Header */}
        <Stack align="center" gap="md">
          <Title
            order={2}
            fw={700}
            ta="center"
            c="#F0EAE3"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3rem)",
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "-0.03em",
              textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
            }}
          >
            Featured Artists
          </Title>
          <Text size="lg" c="#f2f2f2" ta="center" maw="32rem" fw={500}>
            Discover the incredible lineup of artists bringing the best of
            Kizomba, Neo-Soul, and world music to our stages.
          </Text>
        </Stack>

        {/* Artist Grid */}
        <Grid gutter="xl">
          {artists.map((artist) => (
            <Grid.Col key={artist.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ArtistGridCard artist={artist} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
};

export default FeaturedArtistsSection;
