import React from "react";
import {
  Stack,
  Group,
  Paper,
  Text,
  Title,
  Grid,
  Button,
} from "@mantine/core";
import {
  IconMusic,
  IconExternalLink,
} from "@tabler/icons-react";
import { sampleVideos, type Video } from "../data/videosData";

import HeroSection from "../components/home/HeroSection";
import FestivalStats from "../components/home/FestivalStats";
import FeaturedArtistsSection from "../components/home/FeaturedArtistsSection";
import ImportantDates from "../components/home/ImportantDates";

interface HomeProps {
  latest_videos?: Video[];
}

const Home: React.FC<HomeProps> = ({ latest_videos }) => {
  const videos = latest_videos?.length ? latest_videos : sampleVideos;

  return (
    <Stack
      gap={0}
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 15% 85%, #F45D00 0%, transparent 40%),
          radial-gradient(circle at 85% 15%, #F19D58 0%, transparent 45%),
          radial-gradient(circle at 45% 30%, #F45D00 0%, transparent 35%),
          radial-gradient(circle at 70% 70%, #A25A3C 0%, transparent 40%),
          linear-gradient(135deg, #F45D00 0%, #F19D58 25%, #F0EAE3 50%, #C7ACA4 75%, #A25A3C 100%),
          linear-gradient(45deg, rgba(244, 93, 0, 0.2) 0%, rgba(241, 157, 88, 0.1) 100%)
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
        {/* White stars */}
        {[
          { top: "8%", left: "12%", size: "3px", delay: "0s" },
          { top: "22%", left: "78%", size: "2px", delay: "1s" },
          { top: "58%", left: "28%", size: "2.5px", delay: "2s" },
          { top: "82%", left: "68%", size: "2px", delay: "0.5s" },
          { top: "38%", left: "88%", size: "3px", delay: "1.5s" },
          { top: "3%", left: "32%", size: "2px", delay: "2s" },
          { top: "42%", left: "12%", size: "2px", delay: "1s" },
          { top: "78%", left: "92%", size: "2.5px", delay: "0s" },
        ].map((star, i) => (
          <div
            key={`white-star-${i}`}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              backgroundColor: "#FFFFFF",
              borderRadius: "50%",
              animation: `solarTwinkle ${3 + i * 0.5}s ease-in-out infinite ${
                star.delay
              }`,
              boxShadow: "0 0 8px rgba(255,255,255,0.8)",
            }}
          />
        ))}

        {/* Solar ember stars */}
        {[
          {
            top: "28%",
            left: "62%",
            size: "4px",
            color: "#A25A3C",
            delay: "0s",
          },
          {
            top: "48%",
            left: "3%",
            size: "3px",
            color: "#F45D00",
            delay: "1.5s",
          },
          {
            top: "12%",
            left: "72%",
            size: "3.5px",
            color: "#A25A3C",
            delay: "2s",
          },
          {
            top: "68%",
            left: "82%",
            size: "3px",
            color: "#F19D58",
            delay: "0.5s",
          },
          {
            top: "92%",
            left: "32%",
            size: "2.5px",
            color: "#F45D00",
            delay: "3s",
          },
        ].map((star, i) => (
          <div
            key={`ember-star-${i}`}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              borderRadius: "50%",
              animation: `solarFlare ${3.5 + i * 0.3}s ease-in-out infinite ${
                star.delay
              }`,
              boxShadow: `0 0 15px ${star.color}`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes solarTwinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        
        @keyframes solarFlare {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
        
        @keyframes solarPulse {
          0%, 100% { filter: blur(2px); }
          50% { filter: blur(0px); }
        }
      `}</style>

      {/* Hero Section */}
      <HeroSection />

      <ImportantDates />

      <FestivalStats />

      <FeaturedArtistsSection />

      {/* Latest Videos */}
      <Paper
        py="xl"
        px="lg"
        style={{
          background:
            "linear-gradient(180deg, rgba(199, 172, 164, 0.4) 0%, rgba(162, 90, 60, 0.8) 100%)",
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
              c="#F0EAE3"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 3rem)",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: "-0.03em",
                textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
              }}
            >
              Festival Highlights
            </Title>
            <Text size="lg" c="#F0EAE3" ta="center" maw="32rem" fw={500}>
              Relive the magic of previous festivals and get a taste of what
              awaits you.
            </Text>
          </Stack>

          <Grid>
            {videos.slice(0, 6).map((video) => (
              <Grid.Col key={video.id} span={{ base: 12, md: 4 }}>
                <Paper
                  shadow="md"
                  radius="xl"
                  p="lg"
                  h="100%"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(244, 93, 0, 0.3) 0%, rgba(162, 90, 60, 0.4) 50%, rgba(199, 172, 164, 0.2) 100%)",

                    backgroundImage: `linear-gradient(135deg, rgba(244, 93, 0, 0.3) 0%, rgba(162, 90, 60, 0.4) 50%, rgba(199, 172, 164, 0.2) 100%), linear-gradient(135deg, #F19D58 0%, #F45D00 50%, #A25A3C 100%)`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",
                    backdropFilter: "blur(10px)",
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
                              "linear-gradient(135deg, #F45D00 0%, #F19D58 100%)",
                            borderRadius: "50%",
                            width: "4rem",
                            height: "4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconMusic size={24} color="#F0EAE3" />
                        </Paper>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(162, 90, 60, 0.8) 0%, transparent 100%)",
                        }}
                      />
                    </div>

                    <Group justify="space-between" align="flex-start">
                      <Text
                        fw={700}
                        c="#F0EAE3"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                      >
                        {video.title}
                      </Text>
                      <Paper
                        px="xs"
                        py={4}
                        style={{
                          background:
                            "linear-gradient(135deg, #F45D00 0%, #A25A3C 100%)",
                        }}
                        radius="sm"
                      >
                        <Text size="sm" c="#F0EAE3" fw={600}>
                          {video.year}
                        </Text>
                      </Paper>
                    </Group>

                    <Text size="sm" c="#F0EAE3" lineClamp={2} fw={500}>
                      {video.description}
                    </Text>

                    <Button
                      fullWidth
                      rightSection={<IconExternalLink size={16} />}
                      style={{
                        background:
                          "linear-gradient(135deg, #F45D00 0%, #F19D58 50%, #A25A3C 100%)",

                        color: "#F0EAE3",
                        fontWeight: 700,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      }}
                      styles={{
                        root: {
                          "&:hover": {
                            opacity: 0.9,
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(244, 93, 0, 0.4)",
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
          radius="md"
          style={{
            background:
              "linear-gradient(135deg, #F45D00 0%, #F19D58 30%, #C7ACA4 60%, #A25A3C 100%)",

            boxShadow: "0 12px 30px rgba(244, 93, 0, 0.5)",
          }}
        >
          <Stack align="center" gap="lg">
            <Title
              order={2}
              fw={700}
              c="#F0EAE3"
              ta="center"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: "-0.03em",
                textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
              }}
            >
              Ready to Join the Experience?
            </Title>
            <Text
              size="lg"
              c="#F0EAE3"
              ta="center"
              maw="36rem"
              fw={600}
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
              }}
            >
              Don't miss out on the most anticipated Kizomba festival of the
              year. Early bird tickets are now available.
            </Text>
            <Button
              size="lg"
              leftSection={<IconMusic size={20} />}
              style={{
                background: "#F0EAE3",
                color: "#A25A3C",
                fontWeight: 700,
                fontSize: "1.125rem",
                padding: "1rem 2rem",

                boxShadow: "0 6px 20px rgba(240, 234, 227, 0.4)",
              }}
              styles={{
                root: {
                  "&:hover": {
                    backgroundColor: "#FFFFFF",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 25px rgba(240, 234, 227, 0.6)",
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
