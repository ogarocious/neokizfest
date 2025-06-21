import React from "react";
import {
  Stack,
  Group,
  Paper,
  Text,
  Title,
  Grid,
  Button,
  Collapse,
  Badge,
} from "@mantine/core";
import { useState } from "react";
import {
  IconMusic,
  IconCalendar,
  IconExternalLink,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

interface Artist {
  id: number;
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  isDJ: boolean;
  isInstructor: boolean;
  previousEditions: number;
  participatedYears: number[];
  bio: string;
  image: string;
}

interface Video {
  id: number;
  title: string;
  youtube_id: string;
  year: number;
  category: string;
  description: string;
  thumbnail: string;
}

interface HomeProps {
  featured_artists?: Artist[];
  latest_videos?: Video[];
}

const Home: React.FC<HomeProps> = ({ featured_artists, latest_videos }) => {
  const [expandedArtist, setExpandedArtist] = useState<number | null>(null);

  // Sample data for demo
  const sampleArtists: Artist[] = [
    {
      id: 1,
      name: "Carlos Silva",
      city: "Lisbon",
      country: "Portugal",
      countryFlag: "🇵🇹",
      isDJ: true,
      isInstructor: true,
      previousEditions: 3,
      participatedYears: [2022, 2023, 2024],
      bio: "International Kizomba artist with over 10 years of experience bringing authentic rhythms to dance floors worldwide. Carlos has been a cornerstone of the festival since its early days.",
      image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=Carlos+Silva",
    },
    {
      id: 2,
      name: "Maria Santos",
      city: "São Paulo",
      country: "Brazil",
      countryFlag: "🇧🇷",
      isDJ: false,
      isInstructor: true,
      previousEditions: 2,
      participatedYears: [2023, 2024],
      bio: "Dynamic instructor combining modern soul with traditional African influences, creating unforgettable learning experiences for dancers of all levels.",
      image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=Maria+Santos",
    },
    {
      id: 3,
      name: "DJ Kwame",
      city: "Accra",
      country: "Ghana",
      countryFlag: "🇬🇭",
      isDJ: true,
      isInstructor: false,
      previousEditions: 1,
      participatedYears: [2024],
      bio: "Innovative DJ blending global rhythms with contemporary beats, pushing the boundaries of festival music and bringing fresh African sounds to the dance floor.",
      image: "https://placehold.co/400x250/1a1a1a/FF6B35?text=DJ+Kwame",
    },
  ];

  const sampleVideos: Video[] = [
    {
      id: 1,
      title: "Festival Opening 2024",
      youtube_id: "dQw4w9WgXcQ",
      year: 2024,
      category: "Highlights",
      description:
        "Relive the magical opening ceremony from last year's unforgettable festival experience.",
      thumbnail:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      title: "Best Dance Moments",
      youtube_id: "dQw4w9WgXcQ",
      year: 2024,
      category: "Dance",
      description:
        "The most incredible dance performances and spontaneous moments captured throughout the festival.",
      thumbnail:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      title: "Artists Backstage",
      youtube_id: "dQw4w9WgXcQ",
      year: 2024,
      category: "Behind Scenes",
      description:
        "Exclusive behind-the-scenes footage with our featured artists and their creative process.",
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    },
  ];

  const artists = sampleArtists;
  const videos = latest_videos?.length ? latest_videos : sampleVideos;

  return (
    <Stack
      gap={0}
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #171717 0%, #2d1b20 25%, #1a1a1a 50%, #2a1f1f 75%, #171717 100%)",
        color: "white",
        fontFamily: "Poppins, system-ui, sans-serif",
      }}
    >
      {/* Hero Section */}
      <Stack
        gap={0}
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-red-600/20"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-600 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Stack
          align="center"
          gap="xl"
          py={128}
          px="lg"
          style={{ position: "relative", zIndex: 10 }}
          maw="64rem"
          mx="auto"
        >
          <Stack align="center" gap="lg">
            <Title
              order={1}
              fw={900}
              ta="center"
              style={{
                background:
                  "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #C5282F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em",
                fontSize: "clamp(3rem, 8vw, 6rem)",
              }}
            >
              NEOKIZFEST
            </Title>
            <Title
              order={2}
              fw={700}
              c="#F59E0B"
              ta="center"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
              }}
            >
              2025
            </Title>
            <Text size="lg" c="gray.3" fw={500} ta="center">
              9TH ANNUAL • NOVA EDITION
            </Text>
          </Stack>

          <Text size="xl" ta="center" maw="48rem" c="gray.2" lh={1.6}>
            Experience the evolution of Kizomba and Neo-Soul in an unforgettable
            festival atmosphere. Join us for three days of music, dance, and
            cultural celebration.
          </Text>

          <Group gap="lg" justify="center" style={{ flexWrap: "wrap" }}>
            <Button
              size="lg"
              leftSection={<IconMusic size={20} />}
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
                border: "none",
                fontSize: "1.125rem",
                fontWeight: 600,
                padding: "1rem 2rem",
              }}
              className="hover:scale-105 transition-transform duration-200"
            >
              Get Festival Passes
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftSection={<IconCalendar size={20} />}
              c="#F59E0B"
              style={{
                borderColor: "#F59E0B",
                fontSize: "1.125rem",
                fontWeight: 600,
                padding: "1rem 2rem",
              }}
              styles={{
                root: {
                  "&:hover": {
                    backgroundColor: "#F59E0B",
                    color: "white",
                  },
                },
              }}
            >
              View Schedule
            </Button>
          </Group>

          {/* Festival stats */}
          <Grid maw="32rem" w="100%">
            <Grid.Col span={4}>
              <Stack align="center" gap={4}>
                <Text size="2rem" fw={700} c="#F59E0B">
                  20+
                </Text>
                <Text c="gray.5">Artists</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align="center" gap={4}>
                <Text size="2rem" fw={700} c="#F59E0B">
                  3
                </Text>
                <Text c="gray.5">Days</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align="center" gap={4}>
                <Text size="2rem" fw={700} c="#DC2626">
                  500+
                </Text>
                <Text c="gray.5">Attendees</Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>

      {/* Featured Artists */}
      <Paper
        py="xl"
        px="lg"
        style={{
          background: "rgba(17, 24, 39, 0.5)",
          backdropFilter: "blur(8px)",
          border: "none",
        }}
        radius={0}
      >
        <Stack align="center" gap="xl" maw="80rem" mx="auto">
          <Stack align="center" gap="md">
            <Title
              order={2}
              fw={700}
              ta="center"
              c="white"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              Featured Artists
            </Title>
            <Text size="lg" c="gray.3" ta="center" maw="32rem">
              Discover the incredible lineup of artists bringing the best of
              Kizomba, Neo-Soul, and world music to our stages.
            </Text>
          </Stack>

          <Grid>
            {artists.map((artist) => (
              <Grid.Col key={artist.id} span={{ base: 6, md: 6, lg: 4 }}>
                <Paper
                  shadow="lg"
                  radius="md"
                  p="lg"
                  style={{
                    background: "rgba(55, 42, 31, 0.8)",
                    border: "1px solid rgb(99, 84, 75)",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:scale-105 hover:border-orange-500/50"
                >
                  <Stack gap="md">
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "0.75rem",
                      }}
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        style={{
                          width: "100%",
                          height: "16rem",
                          objectFit: "cover",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    <Stack gap="sm">
                      {/* Name and Tags Row */}
                      <Group justify="space-between" align="flex-start" mx={16}>
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Text size="lg" fw={700} c="white">
                            {artist.name}
                          </Text>
                          <Text size="12px" c="gray.3">
                            {artist.city}, {artist.country} {artist.countryFlag}
                          </Text>
                        </Stack>

                        <Group gap="xs">
                          {artist.isDJ && (
                            <Badge
                              size="xs"
                              style={{
                                background: "rgba(249, 115, 22, 0.2)",
                                border: "1px solid rgba(249, 115, 22, 0.3)",
                              }}
                              radius="sm"
                            >
                              <Text size="8px" c="#F59E0B" fw={500}>
                                DJ
                              </Text>
                            </Badge>
                          )}
                          {artist.isInstructor && (
                            <Badge
                              size="xs"
                              style={{
                                background: "rgba(34, 197, 94, 0.2)",
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                              }}
                              radius="sm"
                            >
                              <Text size="8px" c="#22C55E" fw={500}>
                                Instructor
                              </Text>
                            </Badge>
                          )}
                        </Group>
                      </Group>

                      {/* Participation Info */}
                      <Group gap="xs" justify="center" align="center">
                        <Text size="12px" c="#F59E0B" fw={600}>
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
                        <Text size="8px" c="gray.4">
                          {artist.participatedYears?.length > 0
                            ? `${artist.participatedYears.join(", ")}`
                            : "First time participant"}
                        </Text>
                      </Group>

                      {/* Bio Button */}
                      <Button
                        variant="subtle"
                        size="sm"
                        c="gray.3"
                        rightSection={
                          expandedArtist === artist.id ? (
                            <IconChevronUp size={16} />
                          ) : (
                            <IconChevronDown size={16} />
                          )
                        }
                        onClick={() =>
                          setExpandedArtist(
                            expandedArtist === artist.id ? null : artist.id
                          )
                        }
                        styles={{
                          root: {
                            "&:hover": {
                              backgroundColor: "rgba(156, 163, 175, 0.1)",
                            },
                          },
                        }}
                      >
                        {expandedArtist === artist.id ? "Hide Bio" : "Read Bio"}
                      </Button>

                      <Collapse in={expandedArtist === artist.id}>
                        <Paper
                          p="sm"
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(75, 85, 99, 0.5)",
                          }}
                          radius="sm"
                        >
                          <Text size="sm" c="gray.3">
                            {artist.bio}
                          </Text>
                        </Paper>
                      </Collapse>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Paper>

      {/* Latest Videos */}
      <Paper
        py="xl"
        px="lg"
        style={{
          background:
            "linear-gradient(180deg, rgba(31, 41, 55, 0.3) 0%, #1f2937 100%)",
          border: "none",
        }}
        radius={0}
      >
        <Stack align="center" gap="xl" maw="80rem" mx="auto">
          <Stack align="center" gap="md">
            <Title
              order={2}
              fw={700}
              ta="center"
              c="white"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              Festival Highlights
            </Title>
            <Text size="lg" c="gray.3" ta="center" maw="32rem">
              Relive the magic of previous festivals and get a taste of what
              awaits you.
            </Text>
          </Stack>

          <Grid>
            {videos.map((video) => (
              <Grid.Col key={video.id} span={{ base: 12, md: 4 }}>
                <Paper
                  shadow="md"
                  radius="xl"
                  p="lg"
                  h="100%"
                  style={{
                    background: "rgba(31, 41, 55, 0.6)",
                    border: "1px solid rgba(75, 85, 99, 1)",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:scale-105 hover:border-orange-400/50 group"
                  onClick={() =>
                    window.open(
                      `https://youtube.com/watch?v=${video.youtube_id}`,
                      "_blank"
                    )
                  }
                >
                  <Stack gap="md">
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "0.75rem",
                      }}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "12rem",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        className="group-hover:scale-110"
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0, 0, 0, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        }}
                        className="group-hover:opacity-100"
                      >
                        <Paper
                          style={{
                            background: "#F59E0B",
                            borderRadius: "50%",
                            width: "4rem",
                            height: "4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconMusic size={24} color="white" />
                        </Paper>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    <Group justify="space-between" align="flex-start">
                      <Text fw={600} c="white">
                        {video.title}
                      </Text>
                      <Paper
                        px="xs"
                        py={4}
                        style={{
                          background: "rgba(220, 38, 38, 0.2)",
                          border: "1px solid rgba(220, 38, 38, 0.3)",
                        }}
                        radius="sm"
                      >
                        <Text size="sm" c="#DC2626">
                          {video.year}
                        </Text>
                      </Paper>
                    </Group>

                    <Text size="sm" c="gray.3" lineClamp={2}>
                      {video.description}
                    </Text>

                    <Button
                      fullWidth
                      rightSection={<IconExternalLink size={16} />}
                      style={{
                        background:
                          "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
                        border: "none",
                      }}
                      styles={{
                        root: {
                          "&:hover": {
                            opacity: 0.9,
                          },
                        },
                      }}
                    >
                      Watch Now
                    </Button>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Paper>

      {/* CTA Section */}
      <Stack py="xl" px="lg">
        <Paper
          maw="64rem"
          mx="auto"
          p={48}
          radius="xl"
          style={{
            background:
              "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #C5282F 100%)",
          }}
        >
          <Stack align="center" gap="lg">
            <Title
              order={2}
              fw={700}
              c="white"
              ta="center"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              Ready to Join the Experience?
            </Title>
            <Text
              size="lg"
              c="rgba(255, 255, 255, 0.9)"
              ta="center"
              maw="36rem"
            >
              Don't miss out on the most anticipated Kizomba festival of the
              year. Early bird tickets are now available.
            </Text>
            <Button
              size="lg"
              leftSection={<IconMusic size={20} />}
              style={{
                background: "white",
                color: "#F59E0B",
                fontWeight: 600,
                fontSize: "1.125rem",
                padding: "1rem 2rem",
              }}
              styles={{
                root: {
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                },
              }}
            >
              Get Your Tickets Now
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default Home;
