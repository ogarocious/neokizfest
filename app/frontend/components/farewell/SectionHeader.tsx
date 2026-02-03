import React from "react";
import { Title, Text, Stack } from "@mantine/core";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = "left",
}) => {
  return (
    <Stack gap="xs" align={align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"}>
      <Title
        order={2}
        fw={700}
        style={{
          color: "#F45D00",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          letterSpacing: "-0.02em",
        }}
        ta={align}
      >
        {title}
      </Title>
      {subtitle && (
        <Text
          c="#9A8F85"
          maw={600}
          ta={align}
          style={{ lineHeight: 1.6, fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
        >
          {subtitle}
        </Text>
      )}
    </Stack>
  );
};

export default SectionHeader;
