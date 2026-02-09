import React from "react";
import {
  Stack,
  Text,
  Group,
  SimpleGrid,
  Box,
  Divider,
} from "@mantine/core";
import { Link } from "@inertiajs/react";
import {
  IconHeart,
  IconGift,
  IconExternalLink,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  PageHeader,
  BackToHome,
  GradientButton,
} from "../components/shared";
import { colors, responsiveText } from "../styles/theme";

const Support: React.FC = () => {
  // Placeholder Lemon Squeezy URL (to be replaced with actual donation link)
  const donationUrl = "#"; // Will be Lemon Squeezy donation URL

  return (
    <FarewellLayout>
      <Stack gap="lg" maw={800} mx="auto" px="md">
        <PageHeader
          icon={<IconHeart size={32} color="white" fill="white" />}
          title="Support Us"
          subtitle="Thank you for wanting to support Neo Kizomba Festival during this transition. Every bit helps us close this chapter responsibly."
          iconColor="success"
        />

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
        <GlassCard variant="accent" p="md">
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Stack gap={2}>
              <Text fw={500} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                Already have a ticket?
              </Text>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                Start your refund request or donate your pass to support us.
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
