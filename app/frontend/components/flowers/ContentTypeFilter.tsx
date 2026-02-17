import React from "react";
import { Group, Button } from "@mantine/core";
import {
  IconLayoutGrid,
  IconAlignLeft,
  IconPhoto,
  IconMusic,
  IconVideo,
  IconMessage,
} from "@tabler/icons-react";
import { colors } from "../../styles/theme";
import type { FlowerFilter } from "../../types/flowers";

interface ContentTypeFilterProps {
  active: FlowerFilter;
  onChange: (filter: FlowerFilter) => void;
  counts: Record<FlowerFilter, number>;
}

const filters: { value: FlowerFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: <IconLayoutGrid size={16} /> },
  { value: "artist", label: "Artists", icon: <IconMusic size={16} /> },
  { value: "community", label: "Community", icon: <IconMessage size={16} /> },
  { value: "text", label: "Text", icon: <IconAlignLeft size={16} /> },
  { value: "image", label: "Images", icon: <IconPhoto size={16} /> },
  { value: "audio", label: "Audio", icon: <IconMusic size={16} /> },
  { value: "video", label: "Video", icon: <IconVideo size={16} /> },
];

const ContentTypeFilter: React.FC<ContentTypeFilterProps> = ({ active, onChange, counts }) => {
  return (
    <Group gap="xs" wrap="wrap">
      {filters.map((f) => {
        const count = counts[f.value];
        if (f.value !== "all" && count === 0) return null;

        return (
          <Button
            key={f.value}
            size="sm"
            variant={active === f.value ? "filled" : "subtle"}
            color={active === f.value ? "orange" : "gray"}
            leftSection={f.icon}
            onClick={() => onChange(f.value)}
            styles={{
              root: {
                ...(active !== f.value && {
                  color: colors.textMuted,
                }),
              },
            }}
          >
            {f.label}
          </Button>
        );
      })}
    </Group>
  );
};

export default ContentTypeFilter;
