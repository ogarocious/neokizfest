import React from "react";
import { Group, Text, Box } from "@mantine/core";
import {
  IconCheck,
  IconLoader,
  IconClock,
  IconHeart,
  IconDiamond,
} from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";

type EntryStatus = "completed" | "processing" | "submitted" | "waived" | "pending";

interface RefundEntryProps {
  confirmationId: string;
  initials: string;
  status: EntryStatus;
  /** Use compact mode for mobile */
  compact?: boolean;
}

const statusConfig: Record<
  EntryStatus,
  {
    icon: React.FC<{ size: number; stroke?: number }>;
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  completed: {
    icon: IconCheck,
    color: colors.success,
    bgColor: "rgba(34, 139, 34, 0.15)",
    label: "completed",
  },
  processing: {
    icon: IconLoader,
    color: colors.warning,
    bgColor: "rgba(255, 140, 0, 0.15)",
    label: "processing",
  },
  submitted: {
    icon: IconClock,
    color: colors.textMuted,
    bgColor: "rgba(154, 143, 133, 0.15)",
    label: "submitted",
  },
  pending: {
    icon: IconDiamond,
    color: colors.textMuted,
    bgColor: "rgba(154, 143, 133, 0.1)",
    label: "pending",
  },
  waived: {
    icon: IconHeart,
    color: colors.primary,
    bgColor: "rgba(244, 93, 0, 0.15)",
    label: "waived",
  },
};

const RefundEntry: React.FC<RefundEntryProps> = ({
  confirmationId,
  initials,
  status,
  compact = false,
}) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Box
      py={compact ? "xs" : "sm"}
      px={compact ? "sm" : "md"}
      style={{
        background: config.bgColor,
        borderRadius: 8,
        borderLeft: `3px solid ${config.color}`,
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          {/* Status Icon */}
          <Box
            style={{
              width: compact ? 24 : 28,
              height: compact ? 24 : 28,
              borderRadius: "50%",
              background: `${config.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: config.color,
            }}
          >
            <Icon size={compact ? 14 : 16} stroke={2.5} />
          </Box>

          {/* Confirmation # and Initials */}
          <Box>
            <Group gap="xs">
              <Text
                fw={600}
                style={{
                  fontSize: compact ? responsiveText.small : responsiveText.body,
                  color: colors.textPrimary,
                  fontFamily: "monospace",
                }}
              >
                #{confirmationId.replace(/^RR-/, "")}
              </Text>
              <Text
                style={{
                  fontSize: compact ? responsiveText.small : responsiveText.body,
                  color: colors.textSecondary,
                }}
              >
                {initials}
              </Text>
            </Group>
          </Box>
        </Group>

        {/* Status Label */}
        {!compact && (
          <Text
            size="xs"
            fw={500}
            style={{
              color: config.color,
              textTransform: "lowercase",
            }}
          >
            {config.label}
          </Text>
        )}
      </Group>
    </Box>
  );
};

export default RefundEntry;
