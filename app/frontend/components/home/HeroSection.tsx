import { Stack, Text, Box, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import neokizfestLogo from "/assets/NEOKIZ2026.png";
import bgPhoto from "/assets/NKF2024-GROUP2.png";
import CountdownTimer from "./CountdownTimer";
import { IconMapPinFilled } from "@tabler/icons-react";

const HeroSection = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Stack
      gap={0}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: isDesktop ? "100vh" : "auto",
        backgroundImage: `url(${bgPhoto})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background image overlay for better text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(162, 63, 2, 0.7) 0%, rgba(177, 55, 3, 0.58) 50%, rgba(248, 111, 0, 0.72) 100%)",

          zIndex: 1,
        }}
      />

      {/* Solar atmosphere overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(240, 234, 227, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(241, 157, 88, 0.20) 100%)",
          zIndex: 0,
        }}
      />

      {/* Solar flare effects */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.12, zIndex: 3 }}>
        <div
          style={{
            position: "absolute",
            top: "4rem",
            left: "2rem",
            width: "12rem",
            height: "12rem",
            background: "#F45D001-",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "solarPulse 4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "8rem",
            right: "3rem",
            width: "8rem",
            height: "8rem",
            background: "#F19D58",
            borderRadius: "50%",
            filter: "blur(40px)",
            animation: "solarPulse 5s ease-in-out infinite 1s",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "30%",
            width: "14rem",
            height: "14rem",
            background: "#A25A3C10",
            borderRadius: "50%",
            filter: "blur(70px)",
            animation: "solarPulse 6s ease-in-out infinite 2s",
          }}
        />
      </div>

      <Stack
        align="center"
        gap="0"
        py={isDesktop ? 128 : 48}
        px={isDesktop ? "0" : "md"}
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: isDesktop ? "100vh" : "auto",
          justifyContent: "center",
        }}
        maw="64rem"
        mx="auto"
      >
        <Stack align="center" gap="0px">
          <Text
            size={isDesktop ? "2rem" : "0.9rem"}
            m={0}
            c="#FFFFFF"
            fw={700}
            ta="center"
            style={{
              letterSpacing: "-0.02em",
              marginBottom: isDesktop ? "8px" : "4px",
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 4px 4px 12px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            <IconMapPinFilled size={isDesktop ? 32 : 18} />
            AUSTIN, TX | JULY 16-20, 2026
          </Text>
          <Box
            w={isDesktop ? "100%" : "90%"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            p="4px"
          >
            <Image
              src={neokizfestLogo}
              alt="NeokizFest 2026 - Nova Edition"
              w="100%"
              m={0}
              mt={isDesktop ? "-40" : "-16px"}
              fit="contain"
              style={{
                filter: "drop-shadow(0 8px 25px rgba(244, 93, 0, 0.3))",
              }}
            />
          </Box>
        </Stack>

        <CountdownTimer targetDate="2026-07-16T00:00:00" />

        {/* Uncomment these buttons when ready to use them */}
        {/* <Group gap="lg" justify="center" style={{ flexWrap: "wrap" }}>
          <Button
            size="lg"
            leftSection={<IconMusic size={20} />}
            style={{
              background: "linear-gradient(135deg, #F45D00 0%, #A25A3C 100%)",
              fontSize: "1.125rem",
              fontWeight: 600,
              padding: "1rem 2rem",
              color: "#FFFFFF",
              border: "none",
              textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
            }}
            styles={{
              root: {
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 25px rgba(244, 93, 0, 0.6)",
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
              background: "rgba(240, 234, 227, 0.95)",
              fontSize: "1.125rem",
              fontWeight: 600,
              padding: "1rem 2rem",
              border: "none",
              color: "#A25A3C",
            }}
            styles={{
              root: {
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #A25A3C 0%, #F45D00 100%)",
                  color: "#FFFFFF",
                  transform: "scale(1.05)",
                },
              },
            }}
          >
            View Schedule
          </Button>
        </Group> */}
      </Stack>
    </Stack>
  );
};

export default HeroSection;
