import React from "react";
import { Head } from "@inertiajs/react";
import {
  Stack,
  Text,
  Group,
  SimpleGrid,
  Badge,
  Progress as MantineProgress,
  Box,
  Title,
  ScrollArea,
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
  IconQuote,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
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

interface CommunityMessage {
  initials: string;
  message: string;
  type: "refund" | "waive" | "donation";
}

interface ProgressProps {
  last_updated: string;
  stats: ProgressStats;
  refunds: RefundEntryData[];
  community_support: RefundEntryData[];
  donation_stats: DonationStats;
  community_messages: CommunityMessage[];
}

const messageTypeLabel = (type: CommunityMessage["type"]) => {
  switch (type) {
    case "waive": return "Waived Refund";
    case "donation": return "Donor";
    default: return "Pass Holder";
  }
};

const messageTypeColor = (type: CommunityMessage["type"]) => {
  switch (type) {
    case "waive": return colors.primary;
    case "donation": return "#228B22";
    default: return colors.textMuted;
  }
};

const Progress: React.FC<ProgressProps> = ({
  last_updated,
  stats,
  refunds,
  community_support,
  donation_stats,
  community_messages,
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
              color="orange"
              styles={{
                root: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            />
            <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
              {totalResolved} of {stats.total_ticket_holders} pass holders resolved
            </Text>
          </Stack>
        </GlassCard>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing={{ base: "xs", sm: "sm" }}>
          {/* Total Pass Holders */}
          <GlassCard p={{ base: "sm", sm: "md" }}>
            <Stack gap={4} align="center">
              <IconUsers size={20} color={colors.textMuted} />
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                Total Pass Holders
              </Text>
              <Text fw={700} c={colors.textPrimary} style={{ fontSize: responsiveText.large }}>
                {stats.total_ticket_holders}
              </Text>
            </Stack>
          </GlassCard>

          {/* Refund Requests */}
          <GlassCard p={{ base: "sm", sm: "md" }}>
            <Stack gap={4} align="center">
              <IconChartBar size={20} color={colors.textMuted} />
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                Refund Requests
              </Text>
              <Text fw={700} c={colors.textPrimary} style={{ fontSize: responsiveText.large }}>
                {stats.total_requests}
              </Text>
            </Stack>
          </GlassCard>

          {/* Resolved (completed + chargebacks + waived) */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(34, 139, 34, 0.12) 100%)",
              border: "1px solid rgba(34, 139, 34, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconCheck size={20} color="#228B22" />
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                Resolved
              </Text>
              <Text fw={700} c="#228B22" style={{ fontSize: responsiveText.large }}>
                {stats.completed + stats.chargebacks + stats.waived}
              </Text>
            </Stack>
          </GlassCard>

          {/* Processing */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.12) 100%)",
              border: "1px solid rgba(255, 140, 0, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconLoader size={20} color="#FF8C00" />
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                Processing
              </Text>
              <Text fw={700} c="#FF8C00" style={{ fontSize: responsiveText.large }}>
                {stats.processing + stats.submitted}
              </Text>
            </Stack>
          </GlassCard>

          {/* Waived */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(244, 93, 0, 0.08) 0%, rgba(244, 93, 0, 0.12) 100%)",
              border: "1px solid rgba(244, 93, 0, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconHeart size={20} color={colors.primary} fill={colors.primary} />
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                Waived
              </Text>
              <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.large }}>
                {stats.waived}
              </Text>
            </Stack>
          </GlassCard>

          {/* Donations */}
          <GlassCard
            p={{ base: "sm", sm: "md" }}
            style={{
              background: "linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(50, 205, 50, 0.12) 100%)",
              border: "1px solid rgba(34, 139, 34, 0.2)",
            }}
          >
            <Stack gap={4} align="center">
              <IconCash size={20} color="#228B22" />
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                Donated
              </Text>
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

              <Group gap="xs" wrap="wrap">
                {community_support.map((entry) => (
                  <Badge
                    key={entry.id}
                    size="lg"
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

        {/* Community Messages */}
        {community_messages.length > 0 && (
          <GlassCard>
            <Stack gap="md">
              <Group gap="xs">
                <IconQuote size={18} color={colors.primary} />
                <Title order={4} c={colors.primary} style={{ fontSize: responsiveText.sectionTitle }}>
                  Community Messages
                </Title>
              </Group>

              <ScrollArea.Autosize mah={500} type="auto">
                <Stack gap="sm">
                  {community_messages.map((msg, i) => (
                    <Box
                      key={i}
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 8,
                        padding: "12px 16px",
                      }}
                    >
                      <Text
                        size="sm"
                        c={colors.textPrimary}
                        lh={1.6}
                        style={{ fontStyle: "italic" }}
                      >
                        "{msg.message}"
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Text fw={600} size="xs" c={messageTypeColor(msg.type)}>
                          — {msg.initials}
                        </Text>
                        <Badge
                          size="xs"
                          variant="light"
                          color={msg.type === "donation" ? "green" : msg.type === "waive" ? "orange" : "gray"}
                        >
                          {messageTypeLabel(msg.type)}
                        </Badge>
                      </Group>
                    </Box>
                  ))}
                </Stack>
              </ScrollArea.Autosize>
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

              {/* Completed Section */}
              {completedRefunds.length > 0 && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <IconCheck size={14} color={colors.success} />
                    <Text size="sm" c={colors.textMuted} fw={500}>
                      Completed
                    </Text>
                    <Badge size="sm" variant="light" color="green">{completedRefunds.length}</Badge>
                  </Group>
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
                </Box>
              )}

              {/* Processing Section */}
              {processingRefunds.length > 0 && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <IconLoader size={14} color={colors.warning} />
                    <Text size="sm" c={colors.textMuted} fw={500}>
                      Processing
                    </Text>
                    <Badge size="sm" variant="light" color="orange">{processingRefunds.length}</Badge>
                  </Group>
                  <ScrollArea.Autosize mah={300} type="auto">
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
                </Box>
              )}

              {/* Submitted Section */}
              {submittedRefunds.length > 0 && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <IconClock size={14} color={colors.textMuted} />
                    <Text size="sm" c={colors.textMuted} fw={500}>
                      Submitted
                    </Text>
                    <Badge size="sm" variant="light" color="gray">{submittedRefunds.length}</Badge>
                  </Group>
                  <ScrollArea.Autosize mah={300} type="auto">
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
                </Box>
              )}
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
