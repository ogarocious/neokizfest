import React from "react";
import { ScrollArea, Button, Group } from "@mantine/core";
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
  { value: "all", label: "All", icon: <IconLayoutGrid size={14} /> },
  { value: "artist", label: "Artists", icon: <IconMusic size={14} /> },
  { value: "community", label: "Community", icon: <IconMessage size={14} /> },
  { value: "text", label: "Text", icon: <IconAlignLeft size={14} /> },
  { value: "image", label: "Images", icon: <IconPhoto size={14} /> },
  { value: "audio", label: "Audio", icon: <IconMusic size={14} /> },
  { value: "video", label: "Video", icon: <IconVideo size={14} /> },
];

const ContentTypeFilter: React.FC<ContentTypeFilterProps> = ({ active, onChange, counts }) => {
  return (
    <ScrollArea type="auto" offsetScrollbars scrollbarSize={4}>
      <Group gap={6} wrap="nowrap">
        {filters.map((f) => {
          const count = counts[f.value];
          if (f.value !== "all" && count === 0) return null;

          return (
            <Button
              key={f.value}
              size="xs"
              variant={active === f.value ? "filled" : "subtle"}
              color={active === f.value ? "orange" : "gray"}
              leftSection={f.icon}
              onClick={() => onChange(f.value)}
              styles={{
                root: {
                  flexShrink: 0,
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
    </ScrollArea>
  );
};

export default ContentTypeFilter;
