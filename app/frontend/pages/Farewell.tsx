import React from "react";
import {
  Stack,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { Link } from "@inertiajs/react";
import {
  IconTicket,
  IconHeart,
  IconArrowRight,
  IconQuestionMark,
  IconChartBar,
} from "@tabler/icons-react";
import { colors, gradients, responsiveText } from "../styles/theme";
import FarewellLayout from "../components/farewell/FarewellLayout";
import SectionHeader from "../components/farewell/SectionHeader";
import LetterSection from "../components/farewell/LetterSection";
import { GlassCard } from "../components/shared";

const Farewell: React.FC = () => {
  return (
    <FarewellLayout>
      <Stack gap="xl" maw={800} mx="auto" px={{ base: "sm", sm: "md" }}>
        {/* Hero Section - Subdued */}
        <Stack align="center" gap={{ base: "sm", sm: "lg" }} py={{ base: "md", sm: "xl" }}>
          <Box
            style={{
              width: "clamp(70px, 15vw, 120px)",
              height: "clamp(70px, 15vw, 120px)",
              borderRadius: "50%",
              background: gradients.primaryButton,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(244, 93, 0, 0.4)",
            }}
          >
            <Text
              fw={700}
              c="white"
              style={{
                letterSpacing: "-0.02em",
                fontSize: "clamp(0.9rem, 3vw, 1.25rem)",
              }}
            >
              NKF
            </Text>
          </Box>

          <Stack align="center" gap={4}>
            <Title
              order={1}
              fw={700}
              ta="center"
              style={{
                color: colors.primary,
                fontSize: "clamp(1.4rem, 5vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              Neo Kizomba Festival
            </Title>
            <Text
              c={colors.textMuted}
              ta="center"
              fw={500}
              style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)" }}
            >
              2019 - 2024
            </Text>
            <Text
              c={colors.textMuted}
              ta="center"
              maw={500}
              px="sm"
              style={{
                lineHeight: 1.6,
                fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              }}
            >
              After five incredible years of dancing, connection, and community,
              we're closing this chapter with gratitude.
            </Text>
          </Stack>
        </Stack>

        {/* CTA Buttons */}
        <GlassCard variant="accent" p={{ base: "md", sm: "xl" }}>
          <Stack align="center" gap={{ base: "sm", sm: "lg" }}>
            <Text
              fw={600}
              c={colors.textPrimary}
              ta="center"
              style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.125rem)" }}
            >
              How can we help you today?
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: "xs", sm: "md" }} style={{ width: "100%", maxWidth: 500 }}>
              <Link href="/request" style={{ textDecoration: "none" }}>
                <Button
                  fullWidth
                  size="md"
                  leftSection={<IconTicket size={18} />}
                  rightSection={<IconArrowRight size={16} />}
                  style={{
                    background: gradients.primaryButton,
                    color: "white",
                    fontWeight: 600,
                    height: "auto",
                    padding: "clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px)",
                  }}
                >
                  <Stack gap={2} align="flex-start">
                    <Text fw={600} style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)" }}>I Had a Ticket</Text>
                    <Text style={{ fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)" }} opacity={0.8}>Request your refund</Text>
                  </Stack>
                </Button>
              </Link>

              <Link href="/support" style={{ textDecoration: "none" }}>
                <Button
                  fullWidth
                  size="md"
                  variant="outline"
                  leftSection={<IconHeart size={18} />}
                  rightSection={<IconArrowRight size={16} />}
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    fontWeight: 600,
                    height: "auto",
                    padding: "clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px)",
                  }}
                >
                  <Stack gap={2} align="flex-start">
                    <Text fw={600} style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)" }}>I'm Here to Support</Text>
                    <Text style={{ fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)" }} opacity={0.7}>Make a donation</Text>
                  </Stack>
                </Button>
              </Link>
            </SimpleGrid>
          </Stack>
        </GlassCard>

        {/* Farewell Letter */}
        <Stack gap="lg">
          <SectionHeader
            title="A Letter to Our Community"
            subtitle="From everyone at Neo Kizomba Festival"
            align="center"
          />

          <GlassCard p={{ base: "md", sm: "xl" }}>
            <Stack gap="xl">
              <LetterSection
                title="Dear Neo Kizomba Family,"
                content={[
                  "It's with mixed emotions that we share this news with you. After five unforgettable years of bringing our community together through the joy of Kizomba, we've made the difficult decision to close the doors of Neo Kizomba Festival.",
                  "What started as a dream in 2019 grew into something far more beautiful than we ever imagined—a family of dancers, artists, and friends from around the world who shared our passion for connection through dance.",
                ]}
              />

              <LetterSection
                title="What Happened"
                content="[This section will contain an explanation of the circumstances leading to this decision. The organizers will provide this content.]"
              />

              <LetterSection
                title="Our Commitment to You"
                content={[
                  "We understand that many of you had already purchased tickets for our upcoming event. We want to make this right. We're committed to processing refunds for all ticket holders.",
                  "If you would like a full or partial refund, please use our refund request form. We're also offering the option to waive your refund as a gesture of support—we're deeply grateful for any kindness shown during this time.",
                ]}
              />

              <LetterSection
                title="Ways to Support"
                content="If you'd like to help us through this transition, you can waive your refund during the request process, or make a donation on our Support page. Every contribution helps us close this chapter responsibly and ensure everyone is taken care of."
              />

              <LetterSection
                title="The Memories We Made"
                content={[
                  "Over five years, we've welcomed thousands of dancers to our floor. We've watched friendships form, partnerships blossom, and a community grow stronger with every beat.",
                  "From the electrifying performances to the late-night social dancing, from the workshops that pushed us to grow to the quiet moments of connection—these memories will stay with us forever.",
                ]}
              />

              <LetterSection
                title="Thank You"
                content="To every artist who shared their talent, every volunteer who gave their time, every attendee who brought their energy—thank you. You made Neo Kizomba Festival what it was. The end of the festival doesn't mean the end of our community. Keep dancing, keep connecting, keep spreading the joy of Kizomba wherever you go."
              />

              <LetterSection
                content="With all our love and gratitude,"
                signature={{
                  name: "The Neo Kizomba Festival Team",
                  title: "Organizers",
                }}
              />
            </Stack>
          </GlassCard>
        </Stack>

        {/* Quick Links */}
        <GlassCard p={{ base: "md", sm: "lg" }}>
          <Group justify="center" gap={{ base: "md", sm: "xl" }} wrap="wrap">
            <Link href="/faq" style={{ textDecoration: "none" }}>
              <Group gap="xs">
                <IconQuestionMark size={18} color={colors.primary} />
                <Text fw={500} c={colors.primary} style={{ fontSize: responsiveText.small }}>
                  Frequently Asked Questions
                </Text>
              </Group>
            </Link>

            <Link href="/progress" style={{ textDecoration: "none" }}>
              <Group gap="xs">
                <IconChartBar size={18} color={colors.primary} />
                <Text fw={500} c={colors.primary} style={{ fontSize: responsiveText.small }}>
                  View Refund Progress
                </Text>
              </Group>
            </Link>
          </Group>
        </GlassCard>
      </Stack>
    </FarewellLayout>
  );
};

export default Farewell;
