import React, { useState, useEffect } from "react";
import { Stack, Container } from "@mantine/core";
import { router } from "@inertiajs/react";
import FarewellHeader from "./FarewellHeader";
import FarewellFooter from "./FarewellFooter";
import { LoadingOverlay } from "../shared";

interface FarewellLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const FarewellLayout: React.FC<FarewellLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const removeStart = router.on("start", () => setNavigating(true));
    const removeFinish = router.on("finish", () => setNavigating(false));

    return () => {
      removeStart();
      removeFinish();
    };
  }, []);

  return (
    <Stack
      gap={0}
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 20% 80%, rgba(162, 90, 60, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(244, 93, 0, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #141414 100%)
        `,
        color: "#E8E0D8",
        fontFamily: "Poppins, system-ui, sans-serif",
        position: "relative",
      }}
    >
      <LoadingOverlay visible={navigating} message="Loading..." />
      {showHeader && <FarewellHeader />}

      <Container
        size="lg"
        py={{ base: "md", sm: "xl" }}
        style={{
          flex: 1,
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      >
        {children}
      </Container>

      {showFooter && <FarewellFooter />}
    </Stack>
  );
};

export default FarewellLayout;
