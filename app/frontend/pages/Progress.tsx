import React, { useEffect } from "react";
import {
  Stack,
  Text,
  Group,
  SimpleGrid,
  Badge,
  Skeleton,
  Button,
  Progress as MantineProgress,
} from "@mantine/core";
import {
  IconChartBar,
  IconCheck,
  IconLoader,
  IconHeart,
  IconRefresh,
  IconUsers,
  IconInfoCircle,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  PageHeader,
  BackToHome,
  StatusBadge,
} from "../components/shared";
import { useProgressData, isMockMode } from "../hooks/useApi";
import type { PassType } from "../types/refund";
import { colors, responsiveText } from "../styles/theme";

const PASS_TYPE_SHORT: Record<PassType, string> = {
  full_pass: "Full",
  party_pass: "Party",
  workshop_pass: "Workshop",
  vip_pass: "VIP",
  artist_pass: "Artist",
};

const Progress: React.FC = () => {
  const { data, loading, error, fetch } = useProgressData();

  useEffect(() => {
    fetch();
  }, []);

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
  const completionPercentage = data
    ? Math.round(((data.stats.completedRefunds + data.stats.waivedRefunds) / data.stats.totalRequests) * 100)
    : 0;

  return (
    <FarewellLayout>
      <Stack gap="lg" maw={900} mx="auto" px={{ base: "sm", sm: "md" }}>
        <PageHeader
          icon={<IconChartBar size={32} color="white" />}
          title="Refund Progress"
          subtitle="Track our refund process in real-time. We're committed to transparency throughout this transition."
        />

        {/* Mock Mode Indicator */}
        {isMockMode && (
          <GlassCard
            p="sm"
            style={{
              background: "rgba(0, 102, 204, 0.1)",
              border: "1px solid rgba(0, 102, 204, 0.3)",
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <IconInfoCircle size={16} color="#0066CC" style={{ flexShrink: 0 }} />
              <Text style={{ fontSize: responsiveText.small }} c={colors.textSecondary}>
                <strong style={{ color: "#0066CC" }}>Demo Mode:</strong> Showing sample data for demonstration.
              </Text>
            </Group>
          </GlassCard>
        )}

        {/* Loading State */}
        {loading && !data && (
          <Stack gap="md">
            <Skeleton height={80} radius="md" style={{ opacity: 0.3 }} />
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={80} radius="md" style={{ opacity: 0.3 }} />
              ))}
            </SimpleGrid>
            <Skeleton height={150} radius="md" style={{ opacity: 0.3 }} />
          </Stack>
        )}

        {/* Error State */}
        {error && (
          <GlassCard
            p="sm"
            style={{
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
            }}
          >
            <Group justify="space-between" align="center" wrap="wrap" gap="sm">
              <Group gap="xs" wrap="nowrap">
                <IconInfoCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                <Text style={{ fontSize: responsiveText.small }} c={colors.textSecondary}>
                  Unable to load progress data.
                </Text>
              </Group>
              <Button
                variant="light"
                size="xs"
                color="red"
                leftSection={<IconRefresh size={14} />}
                onClick={() => fetch()}
              >
                Retry
              </Button>
            </Group>
          </GlassCard>
        )}

        {/* Stats Cards */}
        {data && (
          <>
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
                  {data.stats.completedRefunds + data.stats.waivedRefunds} of {data.stats.totalRequests} requests resolved
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
                    {data.stats.totalRequests}
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
                    {data.stats.completedRefunds}
                  </Text>
                </Stack>
              </GlassCard>

              {/* Processing */}
              <GlassCard
                p={{ base: "sm", sm: "md" }}
                style={{
                  background: "linear-gradient(135deg, rgba(0, 102, 204, 0.08) 0%, rgba(0, 102, 204, 0.12) 100%)",
                  border: "1px solid rgba(0, 102, 204, 0.2)",
                }}
              >
                <Stack gap={4} align="center">
                  <IconLoader size={20} color="#0066CC" />
                  <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                    Processing
                  </Text>
                  <Text fw={700} c="#0066CC" style={{ fontSize: responsiveText.large }}>
                    {data.stats.processingRefunds}
                  </Text>
                </Stack>
              </GlassCard>

              {/* Waived */}
              <GlassCard
                p={{ base: "sm", sm: "md" }}
                style={{
                  background: "linear-gradient(135deg, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.12) 100%)",
                  border: "1px solid rgba(255, 140, 0, 0.2)",
                }}
              >
                <Stack gap={4} align="center">
                  <IconHeart size={20} color="#FF8C00" fill="#FF8C00" />
                  <Text c={colors.textMuted} ta="center" style={{ fontSize: responsiveText.xs }}>
                    Waived
                  </Text>
                  <Text fw={700} c="#FF8C00" style={{ fontSize: responsiveText.large }}>
                    {data.stats.waivedRefunds}
                  </Text>
                </Stack>
              </GlassCard>
            </SimpleGrid>

            {/* Recent Completions - Card Layout */}
            {data.recentCompletions.length > 0 && (
              <GlassCard
                style={{
                  border: "1px solid rgba(34, 139, 34, 0.15)",
                }}
              >
                <Stack gap="sm">
                  <Group gap="xs">
                    <IconCheck size={16} color="#228B22" />
                    <Text fw={600} c="#228B22" style={{ fontSize: responsiveText.small }}>
                      Recently Completed
                    </Text>
                  </Group>

                  <Stack gap="xs">
                    {data.recentCompletions.map((entry) => (
                      <Group
                        key={entry.id}
                        justify="space-between"
                        align="center"
                        p="xs"
                        style={{
                          background: "rgba(34, 139, 34, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(34, 139, 34, 0.1)",
                        }}
                      >
                        <Group gap="sm">
                          <Badge color="gray" variant="light" size="sm">
                            {entry.initials}
                          </Badge>
                          <Text c={colors.textSecondary} style={{ fontSize: responsiveText.xs }}>
                            {PASS_TYPE_SHORT[entry.passType]} Pass
                          </Text>
                        </Group>
                        <Badge color="green" variant="light" size="xs" leftSection={<IconCheck size={10} />}>
                          Done
                        </Badge>
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </GlassCard>
            )}

            {/* Currently Processing - Card Layout */}
            {data.currentlyProcessing.length > 0 && (
              <GlassCard
                style={{
                  border: "1px solid rgba(0, 102, 204, 0.15)",
                }}
              >
                <Stack gap="sm">
                  <Group gap="xs">
                    <IconLoader size={16} color="#0066CC" />
                    <Text fw={600} c="#0066CC" style={{ fontSize: responsiveText.small }}>
                      Currently Processing
                    </Text>
                  </Group>

                  <Stack gap="xs">
                    {data.currentlyProcessing.map((entry) => (
                      <Group
                        key={entry.id}
                        justify="space-between"
                        align="center"
                        p="xs"
                        style={{
                          background: "rgba(0, 102, 204, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(0, 102, 204, 0.1)",
                        }}
                      >
                        <Group gap="sm">
                          <Badge color="gray" variant="light" size="sm">
                            {entry.initials}
                          </Badge>
                          <Text c={colors.textSecondary} style={{ fontSize: responsiveText.xs }}>
                            {PASS_TYPE_SHORT[entry.passType]} Pass
                          </Text>
                        </Group>
                        <StatusBadge status={entry.status} size="xs" />
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </GlassCard>
            )}

            {/* Waived List (Thank You Section) */}
            {data.waivedList.length > 0 && (
              <GlassCard
                style={{
                  background: "linear-gradient(135deg, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.12) 100%)",
                  border: "1px solid rgba(255, 140, 0, 0.2)",
                }}
              >
                <Stack gap="sm">
                  <Group gap="xs">
                    <IconHeart size={16} color="#FF8C00" fill="#FF8C00" />
                    <Text fw={600} c="#FF8C00" style={{ fontSize: responsiveText.small }}>
                      Thank You to Our Supporters
                    </Text>
                  </Group>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                    These generous individuals chose to waive their refunds:
                  </Text>

                  <Group gap="xs" wrap="wrap">
                    {data.waivedList.map((entry) => (
                      <Badge
                        key={entry.id}
                        size="md"
                        variant="light"
                        color="orange"
                        leftSection={<IconHeart size={10} fill="#FF8C00" />}
                      >
                        {entry.initials}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </GlassCard>
            )}

            {/* Last Updated */}
            <Group justify="space-between" align="center" wrap="wrap" gap="xs">
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.xs }}>
                Updated: {formatLastUpdated(data.lastUpdated)}
              </Text>
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconRefresh size={12} />}
                onClick={() => fetch()}
                loading={loading}
                color="gray"
              >
                Refresh
              </Button>
            </Group>
          </>
        )}

        <BackToHome />
      </Stack>
    </FarewellLayout>
  );
};

export default Progress;
