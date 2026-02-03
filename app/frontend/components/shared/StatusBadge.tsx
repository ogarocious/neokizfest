import React from "react";
import { Badge } from "@mantine/core";
import {
  IconClock,
  IconLoader,
  IconCheck,
  IconPlayerPause,
  IconX,
} from "@tabler/icons-react";
import type { RequestStatus } from "../../types/refund";

interface StatusBadgeProps {
  status: RequestStatus;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; color: string; bgColor: string; Icon: React.FC<any> }
> = {
  pending: {
    label: "Pending",
    color: "#B8860B",
    bgColor: "rgba(184, 134, 11, 0.15)",
    Icon: IconClock,
  },
  processing: {
    label: "Processing",
    color: "#0066CC",
    bgColor: "rgba(0, 102, 204, 0.15)",
    Icon: IconLoader,
  },
  completed: {
    label: "Completed",
    color: "#228B22",
    bgColor: "rgba(34, 139, 34, 0.15)",
    Icon: IconCheck,
  },
  on_hold: {
    label: "On Hold",
    color: "#FF8C00",
    bgColor: "rgba(255, 140, 0, 0.15)",
    Icon: IconPlayerPause,
  },
  cancelled: {
    label: "Cancelled",
    color: "#DC143C",
    bgColor: "rgba(220, 20, 60, 0.15)",
    Icon: IconX,
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "sm" }) => {
  const config = STATUS_CONFIG[status];
  const { Icon } = config;

  return (
    <Badge
      size={size}
      leftSection={<Icon size={14} />}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        textTransform: "none",
      }}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
