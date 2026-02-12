import React from "react";
import { Loader, Stack, Text } from "@mantine/core";
import { colors, responsiveText } from "../../styles/theme";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 15, 15, 0.7)",
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.25s ease",
      }}
    >
      <Stack align="center" gap="md">
        <Loader size="lg" color="#F45D00" type="dots" />
        {message && (
          <Text
            c={colors.textSecondary}
            fw={500}
            ta="center"
            style={{ fontSize: responsiveText.body }}
          >
            {message}
          </Text>
        )}
      </Stack>
    </div>
  );
};

export default LoadingOverlay;
