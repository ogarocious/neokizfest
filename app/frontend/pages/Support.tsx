import React, { useState } from "react";
import {
  Stack,
  Text,
  Group,
  SimpleGrid,
  Box,
  Divider,
  TextInput,
  NumberInput,
  Loader,
} from "@mantine/core";
import { Link } from "@inertiajs/react";
import {
  IconHeart,
  IconGift,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  PageHeader,
  BackToHome,
  GradientButton,
  AlertMessage,
  LoadingOverlay,
} from "../components/shared";
import { colors, responsiveText, mobileInputStyles } from "../styles/theme";
import type { DonationCheckoutResponse } from "../types/donation";

const PRESET_AMOUNTS = [10, 25, 50, 100];

const Support: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetClick = (preset: number) => {
    setSelectedPreset(preset);
    setAmount(preset);
    setError(null);
  };

  const handleCustomAmount = (value: string | number) => {
    setSelectedPreset(null);
    setAmount(value === "" ? "" : Number(value));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^@\s]+@[^@\s]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Please select or enter a donation amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          amount,
        }),
      });

      const data: DonationCheckoutResponse = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.errorMessage || "Unable to start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Unable to connect to the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <FarewellLayout>
      <LoadingOverlay visible={loading} message="Redirecting to payment..." />
      <Stack gap="lg" maw={800} mx="auto" px="md">
        <PageHeader
          icon={<IconHeart size={32} color="white" fill="white" />}
          title="Support Us"
          subtitle="Thank you for wanting to support Neo Kizomba Festival during this transition. Every bit helps us close this chapter responsibly."
          iconColor="success"
        />

        {/* Donation Form */}
        <GlassCard
          style={{
            background: "linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(50, 205, 50, 0.12) 100%)",
            border: "2px solid rgba(34, 139, 34, 0.2)",
          }}
        >
          <form onSubmit={handleSubmit}>
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

              <TextInput
                label="Name"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                styles={() => ({
                  label: mobileInputStyles.label,
                  input: mobileInputStyles.input,
                })}
              />

              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => { setEmail(e.currentTarget.value); setError(null); }}
                styles={() => ({
                  label: mobileInputStyles.label,
                  input: mobileInputStyles.input,
                })}
              />

              {/* Preset amount buttons */}
              <Box>
                <Text
                  fw={500}
                  mb={8}
                  style={{
                    fontSize: responsiveText.small,
                    color: colors.textPrimary,
                  }}
                >
                  Amount <Text component="span" c={colors.error}>*</Text>
                </Text>
                <Group gap="sm">
                  {PRESET_AMOUNTS.map((preset) => (
                    <Box
                      key={preset}
                      component="button"
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      style={{
                        background: selectedPreset === preset
                          ? "linear-gradient(135deg, #228B22 0%, #32CD32 100%)"
                          : "rgba(20, 20, 20, 0.8)",
                        border: selectedPreset === preset
                          ? "1px solid #32CD32"
                          : "1px solid rgba(244, 93, 0, 0.3)",
                        borderRadius: 8,
                        padding: "8px 16px",
                        color: selectedPreset === preset ? "white" : colors.textPrimary,
                        fontWeight: 600,
                        fontSize: responsiveText.body,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      ${preset}
                    </Box>
                  ))}
                </Group>
              </Box>

              <NumberInput
                label="Custom amount"
                placeholder="Enter amount"
                prefix="$"
                min={1}
                decimalScale={2}
                value={selectedPreset ? "" : amount}
                onChange={handleCustomAmount}
                styles={() => ({
                  label: mobileInputStyles.label,
                  input: mobileInputStyles.input,
                })}
              />

              {error && (
                <AlertMessage message={error} onDismiss={() => setError(null)} />
              )}

              <GradientButton
                type="submit"
                buttonVariant="success"
                size="md"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <Group gap="xs" justify="center">
                    <Loader size="xs" color="white" />
                    <span>Redirecting to payment...</span>
                  </Group>
                ) : (
                  `Donate${amount ? ` $${typeof amount === "number" ? amount.toFixed(2) : ""}` : ""}`
                )}
              </GradientButton>
            </Stack>
          </form>
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
