import React from "react";
import { Head } from "@inertiajs/react";
import {
  Stack,
  Paper,
  Text,
  Title,
  Group,
  Button,
  Badge,
  Divider,
  Box,
  CopyButton,
  ActionIcon,
  Tooltip,
  TextInput,
  Loader,
} from "@mantine/core";
import { Link, usePage } from "@inertiajs/react";
import {
  IconCheck,
  IconCopy,
  IconSearch,
  IconQuestionMark,
  IconBrandFacebook,
  IconHeart,
  IconConfetti,
  IconAlertTriangle,
  IconCash,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { CommunityMessageCard } from "../components/shared";
import type { RefundDecision } from "../types/refund";
import { colors, gradients } from "../styles/theme";

const DONATION_AMOUNTS = [10, 25, 50];

const Confirmation: React.FC = () => {
  // Get data from URL params (passed via Inertia)
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] || "");

  const confirmationNumber = params.get("confirmationNumber") || "";
  const email = params.get("email") || "";
  const name = params.get("name") || "";
  const decision = (params.get("decision") as RefundDecision) || "full";
  const refundAmount = parseFloat(params.get("refundAmount") || "0");
  const emailSent = params.get("emailSent") !== "false";

  const isWaived = decision === "waive";

  const [customAmount, setCustomAmount] = React.useState("");
  const [donationLoading, setDonationLoading] = React.useState(false);
  const [donationError, setDonationError] = React.useState<string | null>(null);

  const handleDonate = async (amount: number) => {
    if (amount <= 0 || donationLoading) return;
    setDonationLoading(true);
    setDonationError(null);

    try {
      const res = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, amount, waived: true }),
      });
      const data = await res.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setDonationError(data.errorMessage || "Unable to start checkout. Please try again.");
        setDonationLoading(false);
      }
    } catch {
      setDonationError("Something went wrong. Please try again.");
      setDonationLoading(false);
    }
  };

  return (
    <>
      <Head title="Confirmation">
        <meta name="description" content="Your Neo Kizomba Festival refund request has been submitted." />
        <meta property="og:title" content="Confirmation — Neo Kizomba Festival" />
        <meta property="og:description" content="Your Neo Kizomba Festival refund request has been submitted." />
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
              background: isWaived
                ? "linear-gradient(135deg, #228B22 0%, #32CD32 100%)"
                : gradients.primaryButton,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isWaived
                ? "0 8px 32px rgba(34, 139, 34, 0.3)"
                : "0 8px 32px rgba(244, 93, 0, 0.3)",
            }}
          >
            {isWaived ? (
              <IconHeart size={40} color="white" fill="white" />
            ) : (
              <IconCheck size={40} color="white" />
            )}
          </Box>

          <Stack align="center" gap="xs">
            <Title
              order={1}
              fw={700}
              ta="center"
              style={{
                color: isWaived ? "#228B22" : colors.primary,
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              }}
            >
              {isWaived ? "Thank You for Your Generosity!" : "Request Submitted!"}
            </Title>
            <Text c={colors.textMuted} ta="center" size="lg" maw={400}>
              {isWaived
                ? "Your donation will help us through the closure process."
                : "We've received your refund request and will process it soon."}
            </Text>
          </Stack>
        </Stack>

        {/* Confirmation Number */}
        <Paper
          p={{ base: "md", sm: "xl" }}
          radius="md"
          style={{
            background: gradients.cardBackground,
            border: `2px solid ${colors.borderPrimary}`,
          }}
        >
          <Stack align="center" gap="md">
            <Text size="sm" c={colors.textMuted} tt="uppercase" fw={600}>
              Your Confirmation Number
            </Text>

            <Group gap="xs" align="center" wrap="nowrap">
              <Text
                size="xl"
                fw={700}
                c={colors.primary}
                style={{
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                  fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                  wordBreak: "break-all",
                }}
              >
                {confirmationNumber}
              </Text>

              <CopyButton value={confirmationNumber}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied!" : "Copy"} withArrow>
                    <ActionIcon
                      color={copied ? "green" : "gray"}
                      variant="light"
                      onClick={copy}
                    >
                      {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>

            <Text size="sm" c={colors.textMuted} ta="center">
              Save this number to check your request status at any time.
            </Text>
          </Stack>
        </Paper>

        {/* Email Warning */}
        {!emailSent && (
          <Paper
            p="md"
            radius="md"
            style={{
              background: "rgba(255, 193, 7, 0.08)",
              border: "1px solid rgba(255, 193, 7, 0.3)",
            }}
          >
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconAlertTriangle size={20} color="#FFC107" style={{ flexShrink: 0, marginTop: 2 }} />
              <Text size="sm" c={colors.textMuted}>
                We couldn't send your confirmation email. Please{" "}
                <strong style={{ color: colors.textPrimary }}>save your confirmation number above</strong> —
                you'll need it to check your request status.
              </Text>
            </Group>
          </Paper>
        )}

        {/* Request Summary */}
        <Paper
          p={{ base: "md", sm: "lg" }}
          radius="md"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.borderLight}`,
          }}
        >
          <Stack gap="md">
            <Text fw={600} c={colors.textPrimary}>
              Request Summary
            </Text>
            <Divider color={colors.borderMuted} />

            <Group justify="space-between" wrap="wrap" gap="sm">
              <Text c={colors.textMuted}>Email</Text>
              <Text
                fw={500}
                c={colors.textPrimary}
                style={{
                  wordBreak: "break-all",
                }}
              >
                {email || "---"}
              </Text>
            </Group>

            <Group justify="space-between" wrap="wrap" gap="sm">
              <Text c={colors.textMuted}>Decision</Text>
              <Badge
                color={isWaived ? "green" : "orange"}
                variant="light"
                size="lg"
              >
                {isWaived
                  ? "Refund Waived"
                  : decision === "full"
                  ? "Full Refund"
                  : "Partial Refund"}
              </Badge>
            </Group>

            {!isWaived && (
              <Group justify="space-between" wrap="wrap" gap="sm">
                <Text c={colors.textMuted}>Refund Amount</Text>
                <Text fw={700} c={colors.primary} size="lg">
                  ${refundAmount.toFixed(2)}
                </Text>
              </Group>
            )}
          </Stack>
        </Paper>

        {/* What's Next */}
        <Paper
          p={{ base: "md", sm: "lg" }}
          radius="md"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.borderMuted}`,
          }}
        >
          <Stack gap="md">
            <Text fw={600} c={colors.textPrimary}>
              What Happens Next?
            </Text>

            <Stack gap="sm">
              {!isWaived && (
                <>
                  <Group gap="sm" align="flex-start">
                    <Box
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(244, 93, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Text size="sm" fw={600} c={colors.primary}>
                        1
                      </Text>
                    </Box>
                    <Text size="sm" c={colors.textMuted}>
                      We'll review your request and verify your ticket purchase.
                    </Text>
                  </Group>

                  <Group gap="sm" align="flex-start">
                    <Box
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(244, 93, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Text size="sm" fw={600} c={colors.primary}>
                        2
                      </Text>
                    </Box>
                    <Text size="sm" c={colors.textMuted}>
                      Once approved, your refund will be sent via Zelle to the
                      contact information you provided.
                    </Text>
                  </Group>
                </>
              )}

              <Group gap="sm" align="flex-start">
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(244, 93, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconConfetti size={14} color={colors.primary} />
                </Box>
                <Text size="sm" c={colors.textMuted}>
                  You can check your request status anytime using your
                  confirmation number.
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Paper>

        {/* Community Message */}
        <CommunityMessageCard identifier={confirmationNumber} type="refund" />

        {/* Donation Prompt (Waived Only) */}
        {isWaived && (
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
                <IconCash size={20} color={colors.success} />
                <Text fw={600} c={colors.textPrimary}>
                  Would You Also Like to Make a Donation?
                </Text>
              </Group>
              <Text size="sm" c={colors.textMuted} lh={1.6}>
                Your waiver already means the world. If you'd like to go even further,
                a monetary donation helps us cover refunds, artist payments, and closure costs.
              </Text>

              <Group gap="sm" wrap="wrap">
                {DONATION_AMOUNTS.map((amt) => (
                  <Button
                    key={amt}
                    variant="light"
                    color="green"
                    size="md"
                    onClick={() => handleDonate(amt)}
                    disabled={donationLoading}
                    style={{ minWidth: 80 }}
                  >
                    ${amt}
                  </Button>
                ))}
              </Group>

              <Group gap="xs" align="flex-end" wrap="nowrap">
                <TextInput
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.currentTarget.value.replace(/[^0-9.]/g, ""))}
                  leftSection={<Text size="sm" c={colors.textMuted}>$</Text>}
                  styles={{
                    input: {
                      backgroundColor: "rgba(20, 20, 20, 0.8)",
                      borderColor: "rgba(34, 139, 34, 0.3)",
                      color: colors.textPrimary,
                      fontSize: "1rem",
                    },
                  }}
                  style={{ flex: 1 }}
                  autoComplete="off"
                />
                <Button
                  color="green"
                  size="md"
                  onClick={() => handleDonate(parseFloat(customAmount) || 0)}
                  disabled={donationLoading || !customAmount || parseFloat(customAmount) <= 0}
                >
                  {donationLoading ? <Loader size="xs" color="white" /> : "Donate"}
                </Button>
              </Group>

              {donationError && (
                <Text size="sm" c={colors.error}>
                  {donationError}
                </Text>
              )}
            </Stack>
          </Paper>
        )}

        {/* Action Buttons */}
        <Stack gap="md">
          <Link
            href={`/status?ref=${confirmationNumber}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              fullWidth
              size="lg"
              leftSection={<IconSearch size={20} />}
              style={{
                background: gradients.primaryButton,
              }}
            >
              Check Status
            </Button>
          </Link>

          <Group grow gap="md">
            <Link href="/faq" style={{ textDecoration: "none" }}>
              <Button
                fullWidth
                variant="light"
                color="gray"
                leftSection={<IconQuestionMark size={18} />}
              >
                FAQ
              </Button>
            </Link>

            <Button
              component="a"
              href="https://www.facebook.com/neokizfestival"
              target="_blank"
              variant="light"
              color="blue"
              leftSection={<IconBrandFacebook size={18} />}
            >
              Contact Us
            </Button>
          </Group>

        </Stack>
      </Stack>
    </FarewellLayout>
    </>
  );
};

export default Confirmation;
