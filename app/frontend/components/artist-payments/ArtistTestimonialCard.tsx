import React from "react";
import { Stack, Group, Avatar, Text, Badge } from "@mantine/core";
import { IconQuote } from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard } from "../shared";
import type { ArtistTestimonial } from "../../data/artistPaymentsData";

interface ArtistTestimonialCardProps {
  testimonial: ArtistTestimonial;
}

const ArtistTestimonialCard: React.FC<ArtistTestimonialCardProps> = ({
  testimonial,
}) => {
  return (
    <GlassCard variant="subtle" p={{ base: "md", sm: "lg" }}>
      <Stack gap="md">
        <IconQuote
          size={24}
          color={colors.primary}
          style={{ opacity: 0.5 }}
        />

        <Text
          c={colors.textSecondary}
          style={{
            fontSize: responsiveText.small,
            lineHeight: 1.7,
          }}
        >
          "{testimonial.quote}"
        </Text>

        <Group justify="space-between" wrap="wrap" gap="sm">
          <Group gap="sm" wrap="nowrap">
            <Avatar
              src={testimonial.image}
              size={40}
              radius="md"
              color="orange"
              style={{
                flexShrink: 0,
                border: "2px solid rgba(244, 93, 0, 0.3)",
              }}
            >
              {testimonial.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </Avatar>
            <Stack gap={0}>
              <Text
                fw={600}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.small }}
              >
                {testimonial.name}
              </Text>
              {testimonial.role && (
                <Text
                  c={colors.textMuted}
                  style={{ fontSize: responsiveText.xs }}
                >
                  {testimonial.role}
                </Text>
              )}
            </Stack>
          </Group>

          <Group gap={4} wrap="wrap">
            {testimonial.years.map((year) => (
              <Badge
                key={year}
                size="xs"
                variant="light"
                color="orange"
                style={{
                  background: "rgba(244, 93, 0, 0.1)",
                  border: "1px solid rgba(244, 93, 0, 0.2)",
                }}
              >
                {year}
              </Badge>
            ))}
          </Group>
        </Group>
      </Stack>
    </GlassCard>
  );
};

export default ArtistTestimonialCard;
