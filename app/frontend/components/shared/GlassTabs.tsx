import React from "react";
import { Tabs, type TabsProps } from "@mantine/core";

/**
 * GlassTabs — themed wrapper around Mantine Tabs.
 * Uses pill variant with a glass background on the tab list.
 * Per-tab colors are set via the `color` prop on GlassTabs.Tab.
 *
 * Usage:
 *   <GlassTabs defaultValue="completed">
 *     <GlassTabs.List>
 *       <GlassTabs.Tab value="completed" color="green" leftSection={<Icon />}>
 *         Label
 *       </GlassTabs.Tab>
 *     </GlassTabs.List>
 *     <GlassTabs.Panel value="completed">...</GlassTabs.Panel>
 *   </GlassTabs>
 */
const GlassTabs = ({ children, ...props }: TabsProps) => {
  return (
    <Tabs
      variant="pills"
      styles={{
        list: {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "10px",
          padding: "4px",
          gap: "4px",
        },
      }}
      {...props}
    >
      {children}
    </Tabs>
  );
};

GlassTabs.List = Tabs.List;
GlassTabs.Tab = Tabs.Tab;
GlassTabs.Panel = Tabs.Panel;

export default GlassTabs;
