import React, { useRef, useState, useCallback } from "react";
import AudioPlayerLib from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Box, Text, UnstyledButton } from "@mantine/core";
import { colors, responsiveText } from "../../styles/theme";
import GlassCard from "./GlassCard";

const SPEED_OPTIONS = [1, 1.25, 1.5, 1.75, 2, 0.75] as const;

interface AudioPlayerProps {
  src: string;
  title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  const playerRef = useRef<AudioPlayerLib>(null);
  const [speedIndex, setSpeedIndex] = useState(0);

  const cycleSpeed = useCallback(() => {
    const nextIndex = (speedIndex + 1) % SPEED_OPTIONS.length;
    setSpeedIndex(nextIndex);
    const audio = (playerRef.current as any)?.audio?.current as HTMLAudioElement | undefined;
    if (audio) {
      audio.playbackRate = SPEED_OPTIONS[nextIndex];
    }
  }, [speedIndex]);

  return (
    <GlassCard variant="accent">
      {title && (
        <Text
          fw={600}
          c={colors.textPrimary}
          mb="sm"
          style={{ fontSize: responsiveText.body }}
        >
          {title}
        </Text>
      )}

      <Box style={{ position: "relative" }}>
        <AudioPlayerLib
          ref={playerRef}
          src={src}
          showJumpControls
          progressJumpSteps={{ backward: 15000, forward: 15000 }}
          layout="stacked-reverse"
          customAdditionalControls={[
            <UnstyledButton
              key="speed"
              onClick={cycleSpeed}
              style={{
                background: "rgba(244, 93, 0, 0.15)",
                border: `1px solid rgba(244, 93, 0, 0.3)`,
                borderRadius: 6,
                padding: "2px 8px",
                color: colors.primary,
                fontSize: responsiveText.small,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
                lineHeight: 1.4,
              }}
            >
              {SPEED_OPTIONS[speedIndex]}x
            </UnstyledButton>,
          ]}
        />
      </Box>

      <style>{`
        .rhap_container {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        .rhap_progress-filled,
        .rhap_progress-indicator {
          background-color: ${colors.primary} !important;
        }

        .rhap_progress-bar {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        .rhap_download-progress {
          background-color: rgba(255, 255, 255, 0.15) !important;
        }

        .rhap_time {
          color: ${colors.textMuted} !important;
          font-size: ${responsiveText.small} !important;
        }

        .rhap_button-clear {
          color: ${colors.textPrimary} !important;
          transition: color 0.2s !important;
        }

        .rhap_button-clear:hover {
          color: ${colors.primary} !important;
        }

        .rhap_volume-indicator {
          background: ${colors.primary} !important;
        }

        .rhap_volume-bar {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .rhap_volume-filled {
          background: ${colors.primary} !important;
        }

        .rhap_main-controls-button svg,
        .rhap_volume-button svg {
          color: inherit !important;
        }

        .rhap_repeat-button {
          display: none !important;
        }

        .rhap_additional-controls {
          flex: 0 0 auto !important;
        }
      `}</style>
    </GlassCard>
  );
};

export default AudioPlayer;
