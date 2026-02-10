import React, { useState, useRef, useEffect } from "react";
import { Group, Text, Box } from "@mantine/core";
import { Link, usePage } from "@inertiajs/react";
import {
  IconHome,
  IconQuestionMark,
  IconSearch,
  IconChartBar,
  IconHeart,
  IconCode,
} from "@tabler/icons-react";

const navItems = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/faq", label: "FAQ", icon: IconQuestionMark },
  { href: "/status", label: "Status", icon: IconSearch },
  { href: "/progress", label: "Progress", icon: IconChartBar },
  { href: "/support", label: "Donate", icon: IconHeart },
  { href: "/behind-the-build", label: "Built With", icon: IconCode },
];

const FarewellHeader: React.FC = () => {
  const { url } = usePage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Normalize URL for comparison (remove trailing slash, handle root)
  const currentPath = url.split("?")[0].replace(/\/$/, "") || "/";

  // Check scroll position to show/hide fade indicators
  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 5);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // Scroll active item into view on mount/page change
  useEffect(() => {
    const scrollEl = scrollRef.current;
    const activeEl = activeItemRef.current;

    if (scrollEl && activeEl) {
      // Wait a tick for layout to settle
      setTimeout(() => {
        const scrollRect = scrollEl.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        // Check if active item is outside visible area
        if (activeRect.left < scrollRect.left || activeRect.right > scrollRect.right) {
          activeEl.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }

        // Update fades after scroll
        setTimeout(updateFades, 300);
      }, 50);
    }
  }, [currentPath]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check
    updateFades();

    // Listen for scroll
    el.addEventListener("scroll", updateFades);
    window.addEventListener("resize", updateFades);

    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  return (
    <Box
      py="sm"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(15, 15, 15, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Container with fade indicators */}
      <Box style={{ position: "relative" }}>
        {/* Left fade indicator */}
        <Box
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 32,
            background: "linear-gradient(to right, rgba(15, 15, 15, 0.95) 0%, transparent 100%)",
            zIndex: 10,
            pointerEvents: "none",
            opacity: showLeftFade ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />

        {/* Right fade indicator */}
        <Box
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 32,
            background: "linear-gradient(to left, rgba(15, 15, 15, 0.95) 0%, transparent 100%)",
            zIndex: 10,
            pointerEvents: "none",
            opacity: showRightFade ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />

        {/* Scrollable nav */}
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          <Group
            gap={{ base: "xs", sm: "sm" }}
            wrap="nowrap"
            justify="center"
            style={{ width: "max-content", minWidth: "100%" }}
          >
            {navItems.map((item) => {
              const isActive = currentPath === item.href ||
                (item.href !== "/" && currentPath.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={isActive ? activeItemRef : undefined}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    px={{ base: "sm", sm: "md" }}
                    py={{ base: 6, sm: 8 }}
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(244, 93, 0, 0.2) 0%, rgba(162, 90, 60, 0.25) 100%)"
                        : "rgba(255, 255, 255, 0.03)",
                      borderRadius: 20,
                      border: isActive
                        ? "1px solid rgba(244, 93, 0, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.06)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    className="hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <Group gap={6} wrap="nowrap">
                      <Icon
                        size={16}
                        color={isActive ? "#F45D00" : "#9A8F85"}
                        style={{ flexShrink: 0 }}
                      />
                      <Text
                        fw={isActive ? 600 : 500}
                        style={{
                          color: isActive ? "#F45D00" : "#9A8F85",
                          fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </Text>
                    </Group>
                  </Box>
                </Link>
              );
            })}
          </Group>
        </div>
      </Box>
    </Box>
  );
};

export default FarewellHeader;
