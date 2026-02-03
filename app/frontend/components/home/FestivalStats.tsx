import { Grid, Stack, Text, Paper, Box, rem } from "@mantine/core";

const stats = [
  { label: "Artists", value: "20+", color: "#A25A3C" },
  { label: "Days", value: "3", color: "#F45D00" },
  { label: "Attendees", value: "500+", color: "#A25A3C" },
];

const FestivalStats = () => {
  return (
    <Grid maw="32rem" w="100%" mx="auto" my="xl" gutter="xl" justify="center">
      {stats.map((stat, idx) => (
        <Grid.Col key={idx} span={{ base: 12, sm: 4 }}>
          <Box mx={{ base: "xl", sm: 0 }}>
            <Paper
              shadow="sm"
              radius="lg"
              p="md"
              className="mx-3"
              style={{
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))",
                transition: "all 0.3s ease",
              }}
              withBorder
            >
              <Stack align="center" gap={4}>
                <Text
                  size={rem(36)}
                  fw={600}
                  style={{
                    color: stat.color,
                    fontVariantNumeric: "proportional-nums",
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  size="sm"
                  fw={500}
                  c="#111"
                  style={{
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
                    opacity: 0.65,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {stat.label}
                </Text>
              </Stack>
            </Paper>
          </Box>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default FestivalStats;
