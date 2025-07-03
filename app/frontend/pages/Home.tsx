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
        background: `
          radial-gradient(circle at 20% 80%,rgb(244, 99, 99) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #FF4500 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, #FFD700 0%, transparent 50%),
          linear-gradient(135deg, #FF6B35 0%, #E53E3E 25%,rgba(255, 68, 0, 0.68) 50%, #CC1F1F 75%, #B8860B 100%),
          linear-gradient(45deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 69, 0, 0.2) 100%)
        `,
        color: "#000000",
        fontFamily: "Poppins, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Starfield Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* White stars for contrast against orange background */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: "3px",
            height: "3px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 3s ease-in-out infinite",
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "80%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 4s ease-in-out infinite 1s",
            boxShadow: "0 0 4px rgba(255,255,255,0.6)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "25%",
            width: "2.5px",
            height: "2.5px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 2.5s ease-in-out infinite 2s",
            boxShadow: "0 0 8px rgba(255,255,255,0.8)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "85%",
            left: "70%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 3.5s ease-in-out infinite 0.5s",
            boxShadow: "0 0 5px rgba(255,255,255,0.7)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "90%",
            width: "3px",
            height: "3px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 4.5s ease-in-out infinite 1.5s",
            boxShadow: "0 0 8px rgba(255,255,255,0.8)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "75%",
            left: "10%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 3s ease-in-out infinite 3s",
            boxShadow: "0 0 6px rgba(255,255,255,0.6)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "45%",
            width: "2.5px",
            height: "2.5px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 2s ease-in-out infinite 2.5s",
            boxShadow: "0 0 7px rgba(255,255,255,0.7)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "90%",
            left: "55%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 5s ease-in-out infinite 1s",
            boxShadow: "0 0 5px rgba(255,255,255,0.6)",
          }}
        ></div>

        {/* Deep red/dark nova stars for solar energy contrast */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "65%",
            width: "4px",
            height: "4px",
            backgroundColor: "#B62D14",
            borderRadius: "50%",
            animation: "novaPulse 4s ease-in-out infinite",
            boxShadow: "0 0 12px #B62D14",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            width: "3px",
            height: "3px",
            backgroundColor: "#8B0000",
            borderRadius: "50%",
            animation: "novaPulse 3s ease-in-out infinite 1.5s",
            boxShadow: "0 0 10px #8B0000",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "75%",
            width: "3.5px",
            height: "3.5px",
            backgroundColor: "#B62D14",
            borderRadius: "50%",
            animation: "novaPulse 3.5s ease-in-out infinite 2s",
            boxShadow: "0 0 14px #B62D14",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "85%",
            width: "3px",
            height: "3px",
            backgroundColor: "#8B0000",
            borderRadius: "50%",
            animation: "novaPulse 4.5s ease-in-out infinite 0.5s",
            boxShadow: "0 0 10px #8B0000",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "95%",
            left: "35%",
            width: "2.5px",
            height: "2.5px",
            backgroundColor: "#B62D14",
            borderRadius: "50%",
            animation: "novaPulse 2.5s ease-in-out infinite 3s",
            boxShadow: "0 0 8px #B62D14",
          }}
        ></div>

        {/* More white stars */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "35%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 4s ease-in-out infinite 2s",
            boxShadow: "0 0 5px rgba(255,255,255,0.6)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "15%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 3s ease-in-out infinite 1s",
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "80%",
            left: "95%",
            width: "2.5px",
            height: "2.5px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 5s ease-in-out infinite",
            boxShadow: "0 0 7px rgba(255,255,255,0.8)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 2.5s ease-in-out infinite 4s",
            boxShadow: "0 0 5px rgba(255,255,255,0.6)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: "40%",
            width: "2px",
            height: "2px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "twinkle 3.5s ease-in-out infinite 1.5s",
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
          }}
        ></div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes novaPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* Hero Section */}
      <Stack
        gap={0}
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(254, 248, 217, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(248, 189, 127, 0.08) 100%)",
          }}
        ></div>

        {/* Animated background elements */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
          <div
            style={{
              position: "absolute",
              top: "5rem",
              left: "2.5rem",
              width: "8rem",
              height: "8rem",
              background: "#F06940",
              borderRadius: "50%",
              filter: "blur(48px)",
              animation: "pulse 3s ease-in-out infinite",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "10rem",
              right: "5rem",
              width: "6rem",
              height: "6rem",
              background: "#FDD27C",
              borderRadius: "50%",
              filter: "blur(32px)",
              animation: "pulse 3s ease-in-out infinite 1s",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "5rem",
              left: "33.33%",
              width: "10rem",
              height: "10rem",
              background: "#B62D14",
              borderRadius: "50%",
              filter: "blur(48px)",
              animation: "pulse 3s ease-in-out infinite 2s",
            }}
          ></div>
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
            {/* Placeholder for Photoshop title image */}
            <div
              style={{
                width: "100%",
                height: "200px",
                background:
                  "linear-gradient(135deg, #F06940 0%, #FDD27C 50%, #B62D14 100%)",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid #F8BD7F`,
              }}
            >
              <Text size="lg" c="#FFFFFF" fw={600} ta="center">
                [Your Photoshop NEOKIZFEST Title Image Goes Here]
              </Text>
            </div>
            <Title
              order={2}
              fw={700}
              c="#CC1F1F"
              ta="center"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
              }}
            >
              2025
            </Title>
            <Text size="lg" c="#000000" fw={500} ta="center">
              9TH ANNUAL • NOVA EDITION
            </Text>
          </Stack>

          <Text size="xl" ta="center" maw="48rem" c="#000000" lh={1.6}>
            Experience the evolution of Kizomba and Neo-Soul in an unforgettable
            festival atmosphere. Join us for three days of music, dance, and
            cultural celebration.
          </Text>

          <Group gap="lg" justify="center" style={{ flexWrap: "wrap" }}>
            <Button
              size="lg"
              leftSection={<IconMusic size={20} />}
              style={{
                background: "#CC1F1F",
                border: "2px solid #FFFFFF",
                fontSize: "1.125rem",
                fontWeight: 600,
                padding: "1rem 2rem",
                color: "#FFFFFF",
                boxShadow: "0 4px 15px rgba(204, 31, 31, 0.4)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
              styles={{
                root: {
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 20px rgba(204, 31, 31, 0.6)",
                  },
                },
              }}
            >
              Get Festival Passes
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftSection={<IconCalendar size={20} />}
              style={{
                borderColor: "#CC1F1F",
                background: "rgba(255, 255, 255, 0.9)",
                fontSize: "1.125rem",
                fontWeight: 600,
                padding: "1rem 2rem",
                borderWidth: "2px",
                color: "#CC1F1F",
              }}
              styles={{
                root: {
                  "&:hover": {
                    background: "#CC1F1F",
                    color: "#FFFFFF",
                    transform: "scale(1.05)",
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
                <Text size="2rem" fw={700} c="#CC1F1F">
                  20+
                </Text>
                <Text c="#000000">Artists</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align="center" gap={4}>
                <Text size="2rem" fw={700} c="#CC1F1F">
                  3
                </Text>
                <Text c="#000000">Days</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align="center" gap={4}>
                <Text size="2rem" fw={700} c="#CC1F1F">
                  500+
                </Text>
                <Text c="#000000">Attendees</Text>
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
          background:
            "linear-gradient(180deg, rgba(57, 27, 11, 0.78) 0%, rgba(45, 45, 45, 0.6) 100%)",
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
              c="#FFFFFF"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 3rem)",
                fontFamily: "Rubik, sans-serif",
                letterSpacing: "-0.03em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Featured Artists
            </Title>
            <Text
              size="lg"
              c="rgba(254, 248, 217, 0.8)"
              ta="center"
              maw="32rem"
            >
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
                    background:
                      "linear-gradient(135deg, rgba(182, 45, 20, 0.3) 0%, rgba(240, 105, 64, 0.2) 50%, rgba(248, 189, 127, 0.1) 100%)",
                    border: `2px solid transparent`,
                    backgroundImage: `linear-gradient(135deg, rgba(182, 45, 20, 0.3) 0%, rgba(240, 105, 64, 0.2) 50%, rgba(248, 189, 127, 0.1) 100%), linear-gradient(135deg, #F06940 0%, #FDD27C 50%, #F8BD7F 100%)`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:scale-105"
                >
                  <Stack gap="md">
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "0.75rem",
                        border: `2px solid #FDD27C`,
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
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
                        }}
                      ></div>
                    </div>

                    <Stack gap="sm">
                      {/* Name and Tags Row */}
                      <Group justify="space-between" align="flex-start" mx={16}>
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Text size="lg" fw={700} c="#FFFFFF">
                            {artist.name}
                          </Text>
                          <Text size="12px" c="rgba(254, 248, 217, 0.8)">
                            {artist.city}, {artist.country} {artist.countryFlag}
                          </Text>
                        </Stack>

                        <Group gap="xs">
                          {artist.isDJ && (
                            <Badge
                              size="xs"
                              style={{
                                background:
                                  "linear-gradient(135deg, #F06940 0%, #FDD27C 100%)",
                                border: "1px solid #FDD27C",
                                color: "#FFFFFF",
                              }}
                              radius="sm"
                            >
                              <Text size="8px" c="#FFFFFF" fw={500}>
                                DJ
                              </Text>
                            </Badge>
                          )}
                          {artist.isInstructor && (
                            <Badge
                              size="xs"
                              style={{
                                background:
                                  "linear-gradient(135deg, #B62D14 0%, #F8BD7F 100%)",
                                border: "1px solid #F8BD7F",
                                color: "#FFFFFF",
                              }}
                              radius="sm"
                            >
                              <Text size="8px" c="#FFFFFF" fw={500}>
                                Instructor
                              </Text>
                            </Badge>
                          )}
                        </Group>
                      </Group>

                      {/* Participation Info */}
                      <Group gap="xs" justify="center" align="center">
                        <Text size="12px" c="#FDD27C" fw={600}>
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
                        <Text size="8px" c="#F8BD7F">
                          {artist.participatedYears?.length > 0
                            ? `${artist.participatedYears.join(", ")}`
                            : "First time participant"}
                        </Text>
                      </Group>

                      {/* Bio Button */}
                      <Button
                        variant="subtle"
                        size="sm"
                        c="rgba(254, 248, 217, 0.9)"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(240, 105, 64, 0.2) 0%, rgba(253, 210, 124, 0.1) 100%)",
                        }}
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
                              backgroundColor: "rgba(253, 210, 124, 0.2)",
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
                            background:
                              "linear-gradient(135deg, rgba(182, 45, 20, 0.4) 0%, rgba(10, 10, 10, 0.8) 100%)",
                            border: `1px solid #F8BD7F`,
                          }}
                          radius="sm"
                        >
                          <Text size="sm" c="rgba(254, 248, 217, 0.9)">
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
            "linear-gradient(180deg, rgba(45, 45, 45, 0.3) 0%, rgba(10, 10, 10, 0.8) 100%)",
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
              c="#FFFFFF"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 3rem)",
                fontFamily: "Rubik, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              Festival Highlights
            </Title>
            <Text
              size="lg"
              c="rgba(254, 248, 217, 0.8)"
              ta="center"
              maw="32rem"
            >
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
                    background:
                      "linear-gradient(135deg, rgba(240, 105, 64, 0.2) 0%, rgba(182, 45, 20, 0.3) 50%, rgba(248, 189, 127, 0.1) 100%)",
                    border: `2px solid transparent`,
                    backgroundImage: `linear-gradient(135deg, rgba(240, 105, 64, 0.2) 0%, rgba(182, 45, 20, 0.3) 50%, rgba(248, 189, 127, 0.1) 100%), linear-gradient(135deg, #FDD27C 0%, #F06940 50%, #B62D14 100%)`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:scale-105 group"
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
                        border: `2px solid #FDD27C`,
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
                            background:
                              "linear-gradient(135deg, #F06940 0%, #FDD27C 100%)",
                            borderRadius: "50%",
                            width: "4rem",
                            height: "4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `2px solid #FFFFFF`,
                          }}
                        >
                          <IconMusic size={24} color="white" />
                        </Paper>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
                        }}
                      ></div>
                    </div>

                    <Group justify="space-between" align="flex-start">
                      <Text fw={600} c="#FFFFFF">
                        {video.title}
                      </Text>
                      <Paper
                        px="xs"
                        py={4}
                        style={{
                          background:
                            "linear-gradient(135deg, #F06940 0%, #B62D14 100%)",
                          border: "1px solid #F06940",
                        }}
                        radius="sm"
                      >
                        <Text size="sm" c="#FFFFFF">
                          {video.year}
                        </Text>
                      </Paper>
                    </Group>

                    <Text size="sm" c="rgba(254, 248, 217, 0.8)" lineClamp={2}>
                      {video.description}
                    </Text>

                    <Button
                      fullWidth
                      rightSection={<IconExternalLink size={16} />}
                      style={{
                        background:
                          "linear-gradient(135deg, #F06940 0%, #FDD27C 50%, #F8BD7F 100%)",
                        border: "2px solid #FDD27C",
                        color: "#FFFFFF",
                        fontWeight: 600,
                      }}
                      styles={{
                        root: {
                          "&:hover": {
                            opacity: 0.9,
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 15px rgba(240, 105, 64, 0.3)",
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
              "linear-gradient(135deg, #F06940 0%, #FDD27C 30%, #F8BD7F 60%, #B62D14 100%)",
            border: `3px solid #FEF8D9`,
            boxShadow: "0 8px 25px rgba(240, 105, 64, 0.4)",
          }}
        >
          <Stack align="center" gap="lg">
            <Title
              order={2}
              fw={700}
              c="#FFFFFF"
              ta="center"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontFamily: "Rubik, sans-serif",
                letterSpacing: "-0.03em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Ready to Join the Experience?
            </Title>
            <Text
              size="lg"
              c="#FFFFFF"
              ta="center"
              maw="36rem"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Don't miss out on the most anticipated Kizomba festival of the
              year. Early bird tickets are now available.
            </Text>
            <Button
              size="lg"
              leftSection={<IconMusic size={20} />}
              style={{
                background: "#FFFFFF",
                color: "#B62D14",
                fontWeight: 600,
                fontSize: "1.125rem",
                padding: "1rem 2rem",
                border: `2px solid #FEF8D9`,
                boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
              }}
              styles={{
                root: {
                  "&:hover": {
                    backgroundColor: "#FEF8D9",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(255, 255, 255, 0.4)",
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
