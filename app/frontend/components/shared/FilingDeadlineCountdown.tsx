import React, { useState, useEffect } from "react";
import { Stack, Text, Group } from "@mantine/core";
import { IconCalendarOff, IconCalendar } from "@tabler/icons-react";
import GlassCard from "./GlassCard";
import { colors, responsiveText } from "../../styles/theme";

// 11:59 PM CT on May 15, 2026 = May 16, 2026 05:59 UTC (CT is UTC-5 in May)
const FILING_DEADLINE = new Date("2026-05-16T04:59:00Z");

const FilingDeadlineCountdown: React.FC = () => {
  const calcDaysLeft = () => {
    const diff = FILING_DEADLINE.getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const [daysLeft, setDaysLeft] = useState(calcDaysLeft);
  const isClosed = daysLeft === 0;

  useEffect(() => {
    const interval = setInterval(() => setDaysLeft(calcDaysLeft()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard
      p={{ base: "sm", sm: "md" }}
      style={{
        background: isClosed
          ? "linear-gradient(135deg, rgba(100, 100, 120, 0.08) 0%, rgba(100, 100, 120, 0.14) 100%)"
          : "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.14) 100%)",
        border: isClosed
          ? "1px solid rgba(150, 150, 170, 0.35)"
          : "1px solid rgba(139, 92, 246, 0.4)",
      }}
    >
      {isClosed ? (
        <Group gap="xs" align="center">
          <IconCalendarOff size={18} color="#9ca3af" />
          <Stack gap={2}>
            <Text fw={700} c="#9ca3af" style={{ fontSize: responsiveText.small }}>
              Filing is now closed
            </Text>
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
              The deadline to submit a refund request was May 15, 2026. If you have questions, reach out on our{" "}
              <a
                href="https://www.facebook.com/neokizfestival"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#9ca3af", textDecoration: "underline" }}
              >
                Facebook page.
              </a>
            </Text>
          </Stack>
        </Group>
      ) : (
        <Group gap="xs" align="center" wrap="nowrap">
          <IconCalendar size={18} color="#a78bfa" style={{ flexShrink: 0 }} />
          <Stack gap={2}>
            <Text fw={700} c="#a78bfa" style={{ fontSize: responsiveText.small }}>
              {daysLeft === 1 ? "1 day left to file" : `${daysLeft} days left to file`}
            </Text>
            <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
              Deadline to submit a refund request: <strong style={{ color: colors.textSecondary }}>May 15, 2026</strong>
            </Text>
          </Stack>
        </Group>
      )}
    </GlassCard>
  );
};

export default FilingDeadlineCountdown;
