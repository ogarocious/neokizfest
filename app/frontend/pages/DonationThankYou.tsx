import React from "react";
import { Stack, Paper, Text, Title, Group, Button, Box } from "@mantine/core";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  IconHeart,
  IconHeartHandshake,
  IconMusic,
  IconUsers,
  IconCash,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { CommunityMessageCard } from "../components/shared";
import { colors, gradients } from "../styles/theme";

interface DonationThankYouProps {
  donor_name?: string;
  amount?: number;
  processed?: boolean;
}

const DonationThankYou: React.FC<DonationThankYouProps> = ({
  donor_name,
  amount,
  processed,
}) => {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] || "");
  const orderId = params.get("orderId") || "";

  const displayName = donor_name || "Generous Supporter";
  const hasAmount = typeof amount === "number" && amount > 0;

  return (
    <>
      <Head title="Thank You">
        <meta name="description" content="Thank you for your generous donation to Neo Kizomba Festival." />
        <meta property="og:title" content="Thank You — Neo Kizomba Festival" />
        <meta property="og:description" content="Thank you for your generous donation to Neo Kizomba Festival." />
      </Head>
      <FarewellLayout>
      <Stack gap="xl" maw={700} mx="auto" px={{ base: "sm", sm: "md" }}>
        {/* Success Header */}
        <Stack align="center" gap="md" py="xl">
          <Box
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(34, 139, 34, 0.3)",
            }}
          >
            <IconHeart size={40} color="white" fill="white" />
          </Box>

          <Stack align="center" gap="xs">
            <Title
              order={1}
              fw={700}
              ta="center"
              style={{
                color: colors.success,
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              }}
            >
              Thank You{hasAmount ? `, ${displayName}` : " for Your Support"}!
            </Title>
            {hasAmount ? (
              <Text c={colors.textMuted} ta="center" size="lg" maw={450}>
                Your generous donation of{" "}
                <Text span fw={700} c={colors.success}>
                  ${amount.toFixed(2)}
                </Text>{" "}
                means more than words can express. You're helping our community
                through this transition.
              </Text>
            ) : (
              <Text c={colors.textMuted} ta="center" size="lg" maw={450}>
                Your generosity means more than words can express. You're helping
                our community through this transition.
              </Text>
            )}
          </Stack>
        </Stack>

        {/* What Your Donation Helps With */}
        <Paper
          p={{ base: "md", sm: "lg" }}
          radius="md"
          style={{
            background: gradients.successCard,
            border: "1px solid rgba(34, 139, 34, 0.2)",
          }}
        >
          <Stack gap="md">
            <Group gap="xs">
              <IconHeartHandshake size={20} color={colors.success} />
              <Text fw={600} c={colors.textPrimary}>
                What Your Donation Helps With
              </Text>
            </Group>

            <Stack gap="sm">
              <Group gap="sm" align="flex-start" wrap="nowrap">
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(34, 139, 34, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconCash size={14} color={colors.success} />
                </Box>
                <Text size="sm" c={colors.textMuted}>
                  Processing refunds for ticket holders who need them most
                </Text>
              </Group>

              <Group gap="sm" align="flex-start" wrap="nowrap">
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(34, 139, 34, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconMusic size={14} color={colors.success} />
                </Box>
                <Text size="sm" c={colors.textMuted}>
                  Fulfilling commitments to our incredible artists and DJs
                </Text>
              </Group>

              <Group gap="sm" align="flex-start" wrap="nowrap">
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(34, 139, 34, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconUsers size={14} color={colors.success} />
                </Box>
                <Text size="sm" c={colors.textMuted}>
                  Covering operational costs of closing with integrity
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Paper>

        {/* A Note of Gratitude */}
        <Paper
          p={{ base: "md", sm: "lg" }}
          radius="md"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.borderLight}`,
          }}
        >
          <Stack gap="sm">
            <Text fw={600} c={colors.textPrimary}>
              A Note of Gratitude
            </Text>
            <Text size="sm" c={colors.textMuted} lh={1.6}>
              Every donation, no matter the size, brings us closer to closing
              this chapter the right way. Your support ensures we can honor our
              commitments and take care of the people who made Neo Kizomba
              Festival special.
            </Text>
            <Text size="sm" c={colors.textMuted} lh={1.6}>
              A confirmation email has been sent to your inbox. Thank you for
              being part of this community.
            </Text>
          </Stack>
        </Paper>

        {/* Community Message */}
        {orderId && <CommunityMessageCard identifier={orderId} type="donation" />}

        {/* Action Buttons */}
        <Stack gap="md">
          <Link href="/support" style={{ textDecoration: "none" }}>
            <Button
              fullWidth
              size="lg"
              leftSection={<IconHeart size={20} />}
              style={{
                background: "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
              }}
            >
              Make Another Donation
            </Button>
          </Link>

        </Stack>
      </Stack>
    </FarewellLayout>
    </>
  );
};

export default DonationThankYou;
