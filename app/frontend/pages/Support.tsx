import React from "react";
import {
  Stack,
  Text,
  Group,
  Badge,
  SimpleGrid,
  Box,
  Divider,
} from "@mantine/core";
import { Link } from "@inertiajs/react";
import {
  IconHeart,
  IconShirt,
  IconGift,
  IconExternalLink,
  IconInfoCircle,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  PageHeader,
  BackToHome,
  GradientButton,
} from "../components/shared";
import { SHIRT_SIZES } from "../components/shared/ShirtSizeSelect";
import { colors, responsiveText } from "../styles/theme";

const SHIRT_PRICE = 45;

const Support: React.FC = () => {
  // Placeholder Lemon Squeezy URLs (to be replaced with actual product links)
  const shirtPurchaseUrl = "#"; // Will be Lemon Squeezy product URL
  const donationUrl = "#"; // Will be Lemon Squeezy donation URL

  return (
    <FarewellLayout>
      <Stack gap="lg" maw={800} mx="auto" px={{ base: "sm", sm: "md" }}>
        <PageHeader
          icon={<IconHeart size={32} color="white" fill="white" />}
          title="Support Us"
          subtitle="Thank you for wanting to support Neo Kizomba Festival during this transition. Every bit helps us close this chapter responsibly."
          iconColor="success"
        />

        {/* Coming Soon Notice */}
        <GlassCard
          p="sm"
          style={{
            background: "rgba(255, 140, 0, 0.1)",
            border: "1px solid rgba(255, 140, 0, 0.3)",
          }}
        >
          <Group gap="xs" wrap="nowrap">
            <IconInfoCircle size={16} color="#FF8C00" style={{ flexShrink: 0 }} />
            <Text style={{ fontSize: responsiveText.small }} c={colors.textSecondary}>
              <strong style={{ color: "#FF8C00" }}>Coming Soon:</strong> Our online store is being set up. Ticket holders can get shirts through the refund process.
            </Text>
          </Group>
        </GlassCard>

        {/* Commemorative Shirt */}
        <GlassCard
          style={{
            border: `2px solid ${colors.borderPrimary}`,
          }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <Group gap="sm" wrap="nowrap">
                <Box
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #F45D00 0%, #A25A3C 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconShirt size={28} color="white" />
                </Box>
                <Stack gap={2}>
                  <Text fw={700} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                    Commemorative T-Shirt
                  </Text>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                    Limited edition festival design
                  </Text>
                  <Badge color="orange" variant="light" size="sm">
                    Limited Stock
                  </Badge>
                </Stack>
              </Group>

              <Stack align="flex-end" gap={0}>
                <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.large }}>
                  ${SHIRT_PRICE}
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  per shirt
                </Text>
              </Stack>
            </Group>

            <Divider color="rgba(255, 255, 255, 0.08)" />

            <Stack gap="xs">
              <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small }}>
                <strong style={{ color: colors.textPrimary }}>Description:</strong> High-quality
                cotton t-shirt celebrating five years of Neo Kizomba Festival.
              </Text>

              <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small }}>
                <strong style={{ color: colors.textPrimary }}>Sizes:</strong>{" "}
                {SHIRT_SIZES.map((s) => s.label).join(", ")}
              </Text>

              <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small }}>
                <strong style={{ color: colors.textPrimary }}>Shipping:</strong> US only. Free shipping.
              </Text>
            </Stack>

            <GradientButton
              size="sm"
              fullWidth
              rightSection={<IconExternalLink size={16} />}
              disabled
            >
              {shirtPurchaseUrl === "#" ? "Coming Soon" : "Buy Shirt"}
            </GradientButton>

            <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
              Already have a ticket?{" "}
              <Link href="/request" style={{ color: colors.primary, fontWeight: 500 }}>
                Get your shirt through the refund process
              </Link>
            </Text>
          </Stack>
        </GlassCard>

        {/* Donation Option */}
        <GlassCard
          style={{
            background: "linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(50, 205, 50, 0.12) 100%)",
            border: "2px solid rgba(34, 139, 34, 0.2)",
          }}
        >
          <Stack gap="md">
            <Group gap="sm" wrap="nowrap">
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconGift size={24} color="white" />
              </Box>
              <Stack gap={2}>
                <Text fw={700} c="#228B22" style={{ fontSize: responsiveText.body }}>
                  Make a Donation
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  Support the closure process with any amount
                </Text>
              </Stack>
            </Group>

            <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small }}>
              Donations help us cover final operational costs, process refunds, and close
              this chapter responsibly.
            </Text>

            <GradientButton
              size="sm"
              fullWidth
              buttonVariant="success"
              rightSection={<IconExternalLink size={16} />}
              disabled
            >
              {donationUrl === "#" ? "Coming Soon" : "Make a Donation"}
            </GradientButton>
          </Stack>
        </GlassCard>

        {/* Both Options */}
        <GlassCard variant="accent" p={{ base: "sm", sm: "md" }}>
          <Stack gap="xs">
            <Group gap="xs">
              <IconHeart size={16} color={colors.primary} />
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                Want to do both?
              </Text>
            </Group>
            <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small }}>
              You can purchase a shirt and make a separate donation. Every form
              of support is greatly appreciated!
            </Text>
          </Stack>
        </GlassCard>

        {/* What Your Support Means */}
        <GlassCard>
          <Stack gap="sm">
            <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
              What Your Support Means
            </Text>
            <Divider color="rgba(255, 255, 255, 0.08)" />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <Stack gap={2}>
                <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                  Processing Refunds
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  Helping return money to ticket holders.
                </Text>
              </Stack>

              <Stack gap={2}>
                <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                  Final Operations
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  Covering remaining costs and obligations.
                </Text>
              </Stack>

              <Stack gap={2}>
                <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                  Artist & Vendor Payments
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  Ensuring everyone is compensated fairly.
                </Text>
              </Stack>

              <Stack gap={2}>
                <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                  A Responsible Closure
                </Text>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                  Ending this chapter with integrity.
                </Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </GlassCard>

        {/* Ticket Holder Notice */}
        <GlassCard variant="accent" p={{ base: "sm", sm: "md" }}>
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Stack gap={2}>
              <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                Already have a ticket?
              </Text>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                Start your refund request to get your shirt and/or refund.
              </Text>
            </Stack>
            <Link href="/request" style={{ textDecoration: "none" }}>
              <GradientButton size="xs">
                Request Refund
              </GradientButton>
            </Link>
          </Group>
        </GlassCard>

        <BackToHome />
      </Stack>
    </FarewellLayout>
  );
};

export default Support;
