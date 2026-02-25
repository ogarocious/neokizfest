import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
  Stack,
  Text,
  Group,
  SimpleGrid,
  Badge,
  Progress as MantineProgress,
  Title,
  ScrollArea,
  Popover,
  ActionIcon,
  Box,
  Divider,
} from "@mantine/core";
import {
  IconChartBar,
  IconCheck,
  IconLoader,
  IconHeart,
  IconUsers,
  IconClock,
  IconCash,
  IconStar,
  IconInfoCircle,
  IconAlertCircle,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  GlassTabs,
  PageHeader,
  BackToHome,
  RefundEntry,
} from "../components/shared";
import { colors, responsiveText } from "../styles/theme";

// Types for Inertia props from Rails
interface RefundEntryData {
  id: string;
  initials: string;
  status?: "completed" | "processing" | "submitted" | "pending";
  donated?: boolean;
  paid?: boolean;
}

interface ProgressStats {
  total_ticket_holders: number;
  total_requests: number;
  completed: number;
  processing: number;
  submitted: number;
  waived: number;
  chargebacks: number;
}

interface DonationStats {
  total_donated: number;
  donor_count: number;
  waive_and_donate_count: number;
}

interface ProgressProps {
  last_updated: string;
  stats: ProgressStats;
  refunds: RefundEntryData[];
  community_support: RefundEntryData[];
  donation_stats: DonationStats;
  zelle_paused?: boolean;
}

// 9:00 AM CST = 15:00 UTC (CST is UTC-6)
const ZELLE_RESUME_DATE = new Date("2026-03-22T15:00:00Z");

const Progress: React.FC<ProgressProps> = ({
  last_updated,
  stats,
  refunds,
  community_support,
  donation_stats,
  zelle_paused = false,
}) => {
  const formatLastUpdated = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Calculate completion percentage against all ticket holders
  const totalResolved = stats.completed + stats.waived + stats.chargebacks;
  const completionPercentage = stats.total_ticket_holders > 0
    ? Math.round((totalResolved / stats.total_ticket_holders) * 100)
    : 0;

  // Filter refunds by status
  const completedRefunds = refunds.filter((r) => r.status === "completed");
  const processingRefunds = refunds.filter((r) => r.status === "processing");
  const submittedRefunds = refunds.filter((r) => r.status === "submitted" || r.status === "pending");

  // Default to first non-empty tab in priority order: Completed → Processing → Submitted
  const defaultTab =
    completedRefunds.length > 0
      ? "completed"
      : processingRefunds.length > 0
        ? "processing"
        : "submitted";

  const [activeTab, setActiveTab] = useState(defaultTab);

  const calcTimeLeft = () => {
    const diff = ZELLE_RESUME_DATE.getTime() - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(calcTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head title="Progress">
        <meta name="description" content="Track refund progress transparently. Every step shown publicly." />
        <meta property="og:title" content="Refund Progress — Neo Kizomba Festival" />
        <meta property="og:description" content="Track refund progress transparently. Every step shown publicly." />
      </Head>
      <FarewellLayout>
      <Stack gap="lg" maw={900} mx="auto" px={{ base: "sm", sm: "md" }}>
        <PageHeader
          icon={<IconChartBar size={32} color="white" />}
          title="Refund Progress"
          subtitle="Track our refund process transparently. We're committed to making everyone whole."
        />

        {/* Zelle Paused Notice */}
        {zelle_paused && (
          <>
            <style>{`
              @keyframes zellePulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.35; transform: scale(0.88); }
              }
              @keyframes zelleGlow {
                0%, 100% { box-shadow: 0 0 18px rgba(255, 165, 0, 0.06), 0 0 40px rgba(255, 165, 0, 0.03); }
                50% { box-shadow: 0 0 32px rgba(255, 165, 0, 0.14), 0 0 70px rgba(255, 165, 0, 0.07); }
              }
            `}</style>
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 165, 0, 0.14) 100%)",
              border: "1px solid rgba(255, 165, 0, 0.45)",
              animation: "zelleGlow 2.2s ease-in-out infinite",
            }}
          >
            <Stack gap="xs">
              {timeLeft !== null ? (
                <>
                  <Group gap="xs" align="center">
                    <IconAlertCircle
                      size={18}
                      color="#FFA500"
                      style={{ animation: "zellePulse 2.2s ease-in-out infinite" }}
                    />
                    <Text fw={700} c="#FFA500" style={{ fontSize: responsiveText.small }}>
                      Zelle Payments Temporarily Paused
                    </Text>
                  </Group>
                  <Text c={colors.textSecondary} style={{ fontSize: responsiveText.small }}>
                    I've reached Zelle's 30-day sending limit. We can process your refund earlier — just message us your Wise information, Wise QR code, or Wise tag.
                  </Text>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                    If Zelle is your only option, payments will resume next month. Your refund is confirmed and queued — nothing is lost.
                    {" "}Want to process sooner via Wise? Send your Wise username to the festival{" "}
                    <a
                      href="https://www.facebook.com/neokizfestival"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#FFA500", textDecoration: "underline" }}
                    >
                      Facebook page.
                    </a>
                  </Text>
                  <Divider color="rgba(255, 165, 0, 0.2)" mt={4} />
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs, textAlign: "center" }}>
                    Zelle hit its monthly limit. Payments are queued and will resume in:
                  </Text>
                  <Group gap="xs" wrap="nowrap" justify="center">
                    {[
                      { value: timeLeft.days, label: "days" },
                      { value: timeLeft.hours, label: "hrs" },
                      { value: timeLeft.minutes, label: "min" },
                      { value: timeLeft.seconds, label: "sec" },
                    ].map(({ value, label }) => (
                      <Box
                        key={label}
                        style={{
                          background: "rgba(255, 165, 0, 0.1)",
                          border: "1px solid rgba(255, 165, 0, 0.25)",
                          borderRadius: 8,
                          padding: "6px 10px",
                          textAlign: "center",
                          minWidth: 52,
                        }}
                      >
                        <Text
                          fw={700}
                          c="#FFA500"
                          style={{ fontSize: "1.1rem", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
                        >
                          {String(value).padStart(2, "0")}
                        </Text>
                        <Text
                          c={colors.textMuted}
                          style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}
                        >
                          {label}
                        </Text>
                      </Box>
                    ))}
                  </Group>
                </>
              ) : (
                <Group gap="xs" align="center">
                  <IconCheck
                    size={18}
                    color="#4CAF50"
                  />
                  <Text fw={700} c="#4CAF50" style={{ fontSize: responsiveText.small }}>
                    Zelle payments have resumed.
                  </Text>
                </Group>
              )}
            </Stack>
          </GlassCard>
          </>
        )}

        {/* Overall Progress Bar */}
        <GlassCard variant="accent" p={{ base: "sm", sm: "md" }}>
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.small }}>
                Overall Progress
              </Text>
              <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.body }}>
                {completionPercentage}%
              </Text>
            </Group>
            <MantineProgress
              value={completionPercentage}
              size="lg"
              radius="md"
              styles={{
                root: {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                },
                section: {
                  background: "linear-gradient(90deg, #F45D00 0%, #FF8C00 40%, #FFB347 70%, #FFD700 100%)",
                  backgroundSize: "100vw 100%",
                  boxShadow: "0 0 12px rgba(244, 93, 0, 0.5)",
                },
              }}
            />
            <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
              {totalResolved} of {stats.total_ticket_holders} pass holders resolved
            </Text>
          </Stack>
        </GlassCard>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing={{ base: "xs", sm: "sm" }}>
          {/* 1. Total Pass Holders (independent context) */}
          <GlassCard p={{ base: "sm", sm: "md" }}>
            <Stack gap={4} align="center">
              <IconUsers size={20} color={colors.textMuted} />
              <Group gap={4} align="center" justify="center">
                <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                  Total Pass Holders
                </Text>
                <Popover width={220} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="transparent" size="xs" aria-label="Info about Total Pass Holders">
                      <IconInfoCircle size={14} color={colors.textMuted} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown style={{ backgroundColor: "rgba(30, 30, 30, 0.95)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <Text size="xs" c={colors.textSecondary}>Everyone who purchased a pass for the festival</Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <Text fw={700} c={colors.textPrimary} style={{ fontSize: responsiveText.large }}>
                {stats.total_ticket_holders}
              </Text>
            </Stack>
          </GlassCard>

          {/* 2. Total Requests (pipeline total = Resolved + Processing) */}
          <GlassCard p={{ base: "sm", sm: "md" }}>
            <Stack gap={4} align="center">
              <IconChartBar size={20} color={colors.textMuted} />
              <Group gap={4} align="center" justify="center">
                <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                  Total Requests
                </Text>
                <Popover width={220} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="transparent" size="xs" aria-label="Info about Total Requests">
                      <IconInfoCircle size={14} color={colors.textMuted} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown style={{ backgroundColor: "rgba(30, 30, 30, 0.95)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <Text size="xs" c={colors.textSecondary}>All refund obligations — includes form submissions and chargebacks. Equals Resolved + Processing.</Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <Text fw={700} c={colors.textPrimary} style={{ fontSize: responsiveText.large }}>
                {stats.total_requests + stats.chargebacks}
              </Text>
            </Stack>
          </GlassCard>

          {/* 3. Resolved (completed + waived + chargebacks — books are clean) */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(34, 139, 34, 0.12) 100%)",
              border: "1px solid rgba(34, 139, 34, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconCheck size={20} color="#228B22" />
              <Group gap={4} align="center" justify="center">
                <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                  Resolved
                </Text>
                <Popover width={220} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="transparent" size="xs" aria-label="Info about Resolved">
                      <IconInfoCircle size={14} color={colors.textMuted} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown style={{ backgroundColor: "rgba(30, 30, 30, 0.95)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <Text size="xs" c={colors.textSecondary}>All cases where the books are clean — includes refunds paid out, waived passes, and chargebacks</Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <Text fw={700} c="#228B22" style={{ fontSize: responsiveText.large }}>
                {totalResolved}
              </Text>
            </Stack>
          </GlassCard>

          {/* 4. Processing (submitted + processing + verified — still in pipeline) */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.12) 100%)",
              border: "1px solid rgba(255, 140, 0, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconLoader size={20} color="#FF8C00" />
              <Group gap={4} align="center" justify="center">
                <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                  Processing
                </Text>
                <Popover width={220} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="transparent" size="xs" aria-label="Info about Processing">
                      <IconInfoCircle size={14} color={colors.textMuted} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown style={{ backgroundColor: "rgba(30, 30, 30, 0.95)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <Text size="xs" c={colors.textSecondary}>Requests currently being reviewed, verified, or awaiting payment</Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <Text fw={700} c="#FF8C00" style={{ fontSize: responsiveText.large }}>
                {stats.processing + stats.submitted}
              </Text>
            </Stack>
          </GlassCard>

          {/* 5. Waived (social proof — subset of Resolved) */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(244, 93, 0, 0.08) 0%, rgba(244, 93, 0, 0.12) 100%)",
              border: "1px solid rgba(244, 93, 0, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconHeart size={20} color={colors.primary} fill={colors.primary} />
              <Group gap={4} align="center" justify="center">
                <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                  Waived
                </Text>
                <Popover width={220} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="transparent" size="xs" aria-label="Info about Waived">
                      <IconInfoCircle size={14} color={colors.textMuted} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown style={{ backgroundColor: "rgba(30, 30, 30, 0.95)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <Text size="xs" c={colors.textSecondary}>Pass holders who generously chose to forgo their refund — included in the Resolved count</Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.large }}>
                {stats.waived}
              </Text>
            </Stack>
          </GlassCard>

          {/* 6. Donated (independent — dollars from supporters, bottom-right anchor) */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(50, 205, 50, 0.12) 100%)",
              border: "1px solid rgba(34, 139, 34, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconCash size={20} color="#228B22" />
              <Group gap={4} align="center" justify="center">
                <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                  Donated
                </Text>
                <Popover width={220} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="transparent" size="xs" aria-label="Info about Donated">
                      <IconInfoCircle size={14} color={colors.textMuted} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown style={{ backgroundColor: "rgba(30, 30, 30, 0.95)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <Text size="xs" c={colors.textSecondary}>Total community donations from supporters</Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <Text fw={700} c="#228B22" style={{ fontSize: responsiveText.large }}>
                ${donation_stats.total_donated.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Text>
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                from {donation_stats.donor_count} {donation_stats.donor_count === 1 ? "supporter" : "supporters"}
              </Text>
              {donation_stats.waive_and_donate_count > 0 && (
                <Text c="#FFD700" ta="center" fw={600} style={{ fontSize: responsiveText.xs }}>
                  {donation_stats.waive_and_donate_count} waived + donated
                </Text>
              )}
            </Stack>
          </GlassCard>
        </SimpleGrid>

        {/* Community Support (Waived) — positioned after stats for visibility */}
        {community_support.length > 0 && (
          <GlassCard
            style={{
              background: "linear-gradient(135deg, rgba(244, 93, 0, 0.08) 0%, rgba(162, 90, 60, 0.12) 100%)",
              border: "1px solid rgba(244, 93, 0, 0.2)",
            }}
          >
            <Stack gap="sm">
              <Group gap="xs">
                <IconHeart size={18} color={colors.primary} fill={colors.primary} />
                <Title order={4} c={colors.primary} style={{ fontSize: responsiveText.sectionTitle }}>
                  Community Support
                </Title>
              </Group>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                These generous individuals chose to waive their refunds, supporting the community during this transition.
              </Text>

              <Group gap="xs" wrap="wrap" justify={{ base: "center", sm: "flex-start" }}>
                {community_support.map((entry) => (
                  <Badge
                    key={entry.id}
                    size="md"
                    variant="light"
                    color={entry.donated ? "yellow" : "orange"}
                    leftSection={
                      entry.donated
                        ? <IconStar size={12} fill="#FFD700" color="#FFD700" />
                        : <IconHeart size={12} fill={colors.primary} color={colors.primary} />
                    }
                    style={{
                      backgroundColor: entry.donated
                        ? "rgba(255, 215, 0, 0.15)"
                        : "rgba(244, 93, 0, 0.15)",
                      color: colors.textPrimary,
                      fontWeight: 600,
                      border: entry.donated ? "1px solid rgba(255, 215, 0, 0.3)" : undefined,
                    }}
                  >
                    {entry.initials}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </GlassCard>
        )}

        {/* Refund Requests List */}
        {refunds.length > 0 && (
          <GlassCard>
            <Stack gap="md">
              <Group gap="xs">
                <IconChartBar size={18} color={colors.textSecondary} />
                <Title order={4} c={colors.textPrimary} style={{ fontSize: responsiveText.sectionTitle }}>
                  Refund Requests
                </Title>
              </Group>

              <GlassTabs defaultValue={defaultTab} onChange={(val) => setActiveTab(val ?? defaultTab)}>
                <GlassTabs.List mb="sm">
                  {completedRefunds.length > 0 && (
                    <GlassTabs.Tab
                      value="completed"
                      color="green"
                      leftSection={<IconCheck size={14} />}
                      rightSection={
                        <Badge size="xs" variant={activeTab === "completed" ? "white" : "light"} color="green" ml={4}>
                          {completedRefunds.length}
                        </Badge>
                      }
                    >
                      Completed
                    </GlassTabs.Tab>
                  )}
                  {processingRefunds.length > 0 && (
                    <GlassTabs.Tab
                      value="processing"
                      color="orange"
                      leftSection={<IconLoader size={14} />}
                      rightSection={
                        <Badge size="xs" variant={activeTab === "processing" ? "white" : "light"} color="orange" ml={4}>
                          {processingRefunds.length}
                        </Badge>
                      }
                    >
                      Processing
                    </GlassTabs.Tab>
                  )}
                  {submittedRefunds.length > 0 && (
                    <GlassTabs.Tab
                      value="submitted"
                      color="gray"
                      leftSection={<IconClock size={14} />}
                      rightSection={
                        <Badge size="xs" variant={activeTab === "submitted" ? "white" : "light"} color="gray" ml={4}>
                          {submittedRefunds.length}
                        </Badge>
                      }
                    >
                      Submitted
                    </GlassTabs.Tab>
                  )}
                </GlassTabs.List>

                <GlassTabs.Panel value="completed">
                  <ScrollArea.Autosize mah={400} type="auto">
                    <Stack gap="xs">
                      {completedRefunds.map((entry) => (
                        <RefundEntry
                          key={entry.id}
                          confirmationId={entry.id}
                          initials={entry.initials}
                          status="completed"
                          paid={entry.paid}
                          compact
                        />
                      ))}
                    </Stack>
                  </ScrollArea.Autosize>
                </GlassTabs.Panel>

                <GlassTabs.Panel value="processing">
                  <ScrollArea.Autosize mah={400} type="auto">
                    <Stack gap="xs">
                      {processingRefunds.map((entry) => (
                        <RefundEntry
                          key={entry.id}
                          confirmationId={entry.id}
                          initials={entry.initials}
                          status="processing"
                          paid={entry.paid}
                          compact
                        />
                      ))}
                    </Stack>
                  </ScrollArea.Autosize>
                </GlassTabs.Panel>

                <GlassTabs.Panel value="submitted">
                  <ScrollArea.Autosize mah={400} type="auto">
                    <Stack gap="xs">
                      {submittedRefunds.map((entry) => (
                        <RefundEntry
                          key={entry.id}
                          confirmationId={entry.id}
                          initials={entry.initials}
                          status="submitted"
                          paid={entry.paid}
                          compact
                        />
                      ))}
                    </Stack>
                  </ScrollArea.Autosize>
                </GlassTabs.Panel>
              </GlassTabs>
            </Stack>
          </GlassCard>
        )}

        {/* Last Updated */}
        <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
          Last updated: {formatLastUpdated(last_updated)} · Data refreshes every hour
        </Text>

        <BackToHome />
      </Stack>
    </FarewellLayout>
    </>
  );
};

export default Progress;
