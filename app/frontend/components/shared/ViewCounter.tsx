import React, { useEffect, useState } from "react";
import { Group, Text } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { colors } from "../../styles/theme";

interface ViewCounterProps {
  page: string;
  label?: string;
}

const ViewCounter: React.FC<ViewCounterProps> = ({
  page,
  label = "readers",
}) => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/stats/page-views?page=${encodeURIComponent(page)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.views > 0) setViews(data.views);
      })
      .catch(() => {});
  }, [page]);

  if (views === null) return null;

  return (
    <Group gap={6} justify="center">
      <IconEye size={16} color={colors.textMuted} />
      <Text c={colors.textMuted} size="sm">
        {views.toLocaleString()} {label}
      </Text>
    </Group>
  );
};

export default ViewCounter;
