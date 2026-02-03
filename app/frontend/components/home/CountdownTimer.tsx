import { useState, useEffect } from "react";
import { Text, Grid, Paper, Stack } from "@mantine/core";

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const getTimeRemaining = (targetDate: Date) => {
    const total = targetDate.getTime() - new Date().getTime();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(
    getTimeRemaining(new Date(targetDate))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(new Date(targetDate)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <Grid maw="32rem" w="100%" mx="0" gutter="4px" justify="center">
      {units.map((unit, idx) => (
        <Grid.Col key={idx} span={{ base: 3, sm: 3 }}>
          <Paper
            shadow="sm"
            radius="lg"
            p="md"
            style={{
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.83), rgba(255, 255, 255, 0.85))",
              transition: "all 0.3s ease",
            }}
            withBorder
          >
            <Stack align="center" gap={4}>
              <Text
                size="2rem"
                fw={800}
                style={{
                  fontVariantNumeric: "tabular-nums",
                  color: "#e35305ff",
                  fontFamily: "Poppins",
                }}
              >
                {unit.value.toString().padStart(2, "0")}
              </Text>
              <Text
                size="xs"
                fw={500}
                style={{
                  color: "#555",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
                }}
              >
                {unit.label}
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default CountdownTimer;
