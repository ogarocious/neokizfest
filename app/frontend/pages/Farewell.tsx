import React from "react";
import { Head } from "@inertiajs/react";
import {
  Stack,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Box,
  Image,
} from "@mantine/core";
import { Link } from "@inertiajs/react";
import {
  IconTicket,
  IconHeart,
  IconArrowRight,
  IconQuestionMark,
  IconChartBar,
  IconCash,
  IconHeartHandshake,
  IconGift,
  IconSearch,
} from "@tabler/icons-react";
import { colors, gradients, responsiveText } from "../styles/theme";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { GlassCard } from "../components/shared";

interface OptionRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const OptionRow: React.FC<OptionRowProps> = ({ icon, title, description }) => (
  <Group
    gap="sm"
    wrap="nowrap"
    p="sm"
    style={{
      background: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: 10,
    }}
  >
    <Box
      style={{
        width: 32,
        height: 32,
        minWidth: 32,
        borderRadius: 8,
        background: "rgba(244, 93, 0, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Stack gap={2}>
      <Text
        fw={600}
        c={colors.textPrimary}
        style={{ fontSize: responsiveText.small }}
      >
        {title}
      </Text>
      <Text
        c={colors.textMuted}
        style={{ fontSize: responsiveText.xs, lineHeight: 1.4 }}
      >
        {description}
      </Text>
    </Stack>
  </Group>
);

const Farewell: React.FC = () => {
  return (
    <>
      <Head title="Home">
        <meta
          name="description"
          content="The Neo Kizomba Festival is ending. 8 Editions. 10 Years. One legacy."
        />
        <meta property="og:title" content="The Neo Kizomba Festival" />
        <meta
          property="og:description"
          content="The Neo Kizomba Festival is ending. 8 Editions. 10 Years. One legacy."
        />
      </Head>
      <FarewellLayout>
        <Stack gap="xl" maw={800} mx="auto" px={{ base: "sm", sm: "md" }}>
          {/* Hero Section */}
          <Stack align="center" gap="md" py={{ base: "md", sm: "xl" }}>
            <Box
              style={{ borderRadius: 12, overflow: "hidden", width: "100%" }}
            >
              <Image
                src="/images/og-default.png"
                alt="Neo Kizomba Festival — 8 editions of flyers from 2015 to 2024"
                radius="md"
              />
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
                The Neo Kizomba Festival
              </Title>
              <Text
                c={colors.textMuted}
                ta="center"
                fw={500}
                style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)" }}
              >
                8 Editions. 10 Years. One Legacy.
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
                Thank you for being part of the journey.
              </Text>
            </Stack>
          </Stack>

          {/* Decision Tree */}
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing={{ base: "md", sm: "lg" }}
          >
            {/* Card A: I Had a Ticket */}
            <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
              <Stack gap="md" h="100%">
                <Group gap="sm" wrap="nowrap">
                  <IconTicket size={22} color={colors.primary} />
                  <Stack gap={2}>
                    <Text
                      fw={600}
                      c={colors.textPrimary}
                      style={{ fontSize: responsiveText.body }}
                    >
                      I Had a Ticket
                    </Text>
                    <Text
                      c={colors.textMuted}
                      style={{ fontSize: responsiveText.xs }}
                    >
                      Choose your path below
                    </Text>
                  </Stack>
                </Group>

                <Stack gap="xs" style={{ flex: 1 }}>
                  <OptionRow
                    icon={<IconCash size={16} color={colors.primary} />}
                    title="Request a Full Refund"
                    description="Get your money back via Zelle or Wise"
                  />
                  <OptionRow
                    icon={
                      <IconHeartHandshake size={16} color={colors.primary} />
                    }
                    title="Waive My Refund"
                    description="Release your refund to support the closure"
                  />
                  <OptionRow
                    icon={<IconGift size={16} color={colors.primary} />}
                    title="Waive & Donate"
                    description="Waive your refund and add a donation on top"
                  />
                </Stack>

                <Link href="/request" style={{ textDecoration: "none" }}>
                  <Button
                    fullWidth
                    size="md"
                    rightSection={<IconArrowRight size={16} />}
                    style={{
                      background: gradients.primaryButton,
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Start My Request
                  </Button>
                </Link>
              </Stack>
            </GlassCard>

            {/* Card B: I'm Here to Support */}
            <GlassCard variant="default" p={{ base: "md", sm: "lg" }}>
              <Stack gap="md" h="100%" justify="center">
                <Group gap="sm" wrap="nowrap">
                  <IconHeart size={22} color={colors.primary} />
                  <Stack gap={2}>
                    <Text
                      fw={600}
                      c={colors.textPrimary}
                      style={{ fontSize: responsiveText.body }}
                    >
                      I'm Here to Support
                    </Text>
                    <Text
                      c={colors.textMuted}
                      style={{ fontSize: responsiveText.xs }}
                    >
                      No ticket needed
                    </Text>
                  </Stack>
                </Group>

                <OptionRow
                  icon={<IconHeart size={16} color={colors.primary} />}
                  title="Make a Donation"
                  description="Help cover refund processing and closure costs"
                />

                <Link href="/support" style={{ textDecoration: "none" }}>
                  <Button
                    fullWidth
                    size="md"
                    rightSection={<IconArrowRight size={16} />}
                    style={{
                      background: gradients.primaryButton,
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Go to Donations
                  </Button>
                </Link>
              </Stack>
            </GlassCard>
          </SimpleGrid>

          {/* Story Teaser */}
          <Link href="/choosing-myself" style={{ textDecoration: "none" }}>
            <GlassCard
              variant="subtle"
              p={{ base: "md", sm: "lg" }}
              style={{
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
            >
              <Group justify="space-between" wrap="nowrap" gap="md">
                <Box
                  style={{
                    width: 80,
                    minWidth: 80,
                    aspectRatio: "16 / 9",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/images/choosing-myself/hero.jpg"
                    alt="Choosing Myself"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Stack gap={2} style={{ flex: 1 }}>
                  <Text
                    fw={600}
                    c={colors.textPrimary}
                    style={{ fontSize: responsiveText.body }}
                  >
                    Read or Listen to My Story
                  </Text>
                  <Text
                    c={colors.textMuted}
                    style={{ fontSize: responsiveText.small }}
                  >
                    Choosing Myself — the story behind this decision
                  </Text>
                </Stack>
                <IconArrowRight
                  size={20}
                  color={colors.primary}
                  style={{ flexShrink: 0 }}
                />
              </Group>
            </GlassCard>
          </Link>

          {/* Quick Links */}
          <GlassCard p="md">
            <Group justify="center" gap="lg" wrap="wrap">
              <Link href="/faq" style={{ textDecoration: "none" }}>
                <Group gap="xs">
                  <IconQuestionMark size={18} color={colors.primary} />
                  <Text
                    fw={500}
                    c={colors.primary}
                    style={{ fontSize: responsiveText.small }}
                  >
                    Frequently Asked Questions
                  </Text>
                </Group>
              </Link>

              <Link href="/progress" style={{ textDecoration: "none" }}>
                <Group gap="xs">
                  <IconChartBar size={18} color={colors.primary} />
                  <Text
                    fw={500}
                    c={colors.primary}
                    style={{ fontSize: responsiveText.small }}
                  >
                    View Refund Progress
                  </Text>
                </Group>
              </Link>

              <Link href="/status" style={{ textDecoration: "none" }}>
                <Group gap="xs">
                  <IconSearch size={18} color={colors.primary} />
                  <Text
                    fw={500}
                    c={colors.primary}
                    style={{ fontSize: responsiveText.small }}
                  >
                    Check My Status
                  </Text>
                </Group>
              </Link>
            </Group>
          </GlassCard>
        </Stack>
      </FarewellLayout>
    </>
  );
};

export default Farewell;
