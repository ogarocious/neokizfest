import React from "react";
import {
  Stack,
  Text,
  Group,
  SimpleGrid,
  Badge,
  Progress as MantineProgress,
  Box,
  Title,
} from "@mantine/core";
import {
  IconChartBar,
  IconCheck,
  IconLoader,
  IconHeart,
  IconUsers,
  IconClock,
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
}

interface ProgressStats {
  total_requests: number;
  completed: number;
  processing: number;
  submitted: number;
  waived: number;
}

interface ProgressProps {
  last_updated: string;
  stats: ProgressStats;
  refunds: RefundEntryData[];
  community_support: RefundEntryData[];
}

const Progress: React.FC<ProgressProps> = ({
  last_updated,
  stats,
  refunds,
  community_support,
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

  // Calculate completion percentage
  const totalResolved = stats.completed + stats.waived;
  const completionPercentage = stats.total_requests > 0
    ? Math.round((totalResolved / stats.total_requests) * 100)
    : 0;

  // Filter refunds by status
  const completedRefunds = refunds.filter((r) => r.status === "completed");
  const processingRefunds = refunds.filter((r) => r.status === "processing");
  const submittedRefunds = refunds.filter((r) => r.status === "submitted" || r.status === "pending");

  return (
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
              {totalResolved} of {stats.total_requests} requests resolved
            </Text>
          </Stack>
        </GlassCard>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={{ base: "xs", sm: "sm" }}>
          {/* Total Requests */}
          <GlassCard p={{ base: "sm", sm: "md" }}>
            <Stack gap={4} align="center">
              <IconUsers size={20} color={colors.textMuted} />
              <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                Total Requests
              </Text>
              <Text fw={700} c={colors.textPrimary} style={{ fontSize: responsiveText.large }}>
                {stats.total_requests}
              </Text>
            </Stack>
          </GlassCard>

          {/* Completed */}
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
                Completed
              </Text>
              <Text fw={700} c="#228B22" style={{ fontSize: responsiveText.large }}>
                {stats.completed}
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
        </SimpleGrid>

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
                      Completed ({completedRefunds.length})
                    </Text>
                  </Group>
                  <Stack gap="xs">
                    {completedRefunds.map((entry) => (
                      <RefundEntry
                        key={entry.id}
                        confirmationId={entry.id}
                        initials={entry.initials}
                        status="completed"
                        compact
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Processing Section */}
              {processingRefunds.length > 0 && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <IconLoader size={14} color={colors.warning} />
                    <Text size="sm" c={colors.textMuted} fw={500}>
                      Processing ({processingRefunds.length})
                    </Text>
                  </Group>
                  <Stack gap="xs">
                    {processingRefunds.map((entry) => (
                      <RefundEntry
                        key={entry.id}
                        confirmationId={entry.id}
                        initials={entry.initials}
                        status="processing"
                        compact
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Submitted Section */}
              {submittedRefunds.length > 0 && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <IconClock size={14} color={colors.textMuted} />
                    <Text size="sm" c={colors.textMuted} fw={500}>
                      Submitted ({submittedRefunds.length})
                    </Text>
                  </Group>
                  <Stack gap="xs">
                    {submittedRefunds.map((entry) => (
                      <RefundEntry
                        key={entry.id}
                        confirmationId={entry.id}
                        initials={entry.initials}
                        status="submitted"
                        compact
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </GlassCard>
        )}

        {/* Community Support (Waived) */}
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
                    color="orange"
                    leftSection={<IconHeart size={12} fill={colors.primary} color={colors.primary} />}
                    style={{
                      backgroundColor: "rgba(244, 93, 0, 0.15)",
                      color: colors.textPrimary,
                      fontWeight: 600,
                    }}
                  >
                    {entry.initials}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </GlassCard>
        )}

        {/* Last Updated */}
        <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
          Last updated: {formatLastUpdated(last_updated)}
        </Text>

        <BackToHome />
      </Stack>
    </FarewellLayout>
  );
};

export default Progress;
