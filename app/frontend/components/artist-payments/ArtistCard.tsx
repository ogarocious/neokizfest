import React, { useState } from "react";
import { Stack, Text, Badge, Image, Modal, Box, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconClock, IconEye } from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import { GlassCard } from "../shared";
import type { Artist } from "../../data/artistPaymentsData";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [proofOpen, setProofOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <UnstyledButton
        onClick={artist.proofImages?.length ? () => setProofOpen(true) : undefined}
        style={{ cursor: artist.proofImages?.length ? "pointer" : "default" }}
      >
        <GlassCard
          variant="subtle"
          p={0}
          style={{
            overflow: "hidden",
            transition: "border-color 0.2s ease",
            borderColor: artist.confirmed
              ? "rgba(34, 139, 34, 0.5)"
              : undefined,
          }}
        >
          {/* Artist image */}
          <Box
            style={{
              aspectRatio: "1",
              background: "rgba(244, 93, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {artist.image ? (
              <Image
                src={artist.image}
                alt={artist.name}
                fit="cover"
                h="100%"
                w="100%"
              />
            ) : (
              <Text
                fw={700}
                c={colors.textDim}
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
              >
                {artist.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </Text>
            )}

            {/* Status overlay badge */}
            <Badge
              size={isDesktop ? "md" : "sm"}
              variant="filled"
              color={artist.confirmed ? "green" : "gray"}
              leftSection={
                artist.confirmed ? (
                  <IconCheck size={isDesktop ? 12 : 10} />
                ) : (
                  <IconClock size={isDesktop ? 12 : 10} />
                )
              }
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: artist.confirmed
                  ? "rgba(34, 139, 34, 0.85)"
                  : "rgba(80, 80, 80, 0.85)",
                backdropFilter: "blur(4px)",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
              }}
            >
              {artist.confirmed ? "Confirmed" : "Pending"}
            </Badge>

            {/* Proof indicator */}
            {artist.proofImages?.length && (
              <Box
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  background: "rgba(244, 93, 0, 0.85)",
                  backdropFilter: "blur(4px)",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
                  borderRadius: 4,
                  padding: isDesktop ? "3px 8px" : "2px 6px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <IconEye size={isDesktop ? 14 : 12} color="white" />
                <Text c="white" style={{ fontSize: isDesktop ? "0.75rem" : "0.65rem" }} fw={600}>
                  View Proof
                </Text>
              </Box>
            )}
          </Box>

          {/* Name */}
          <Box px="sm" py="xs">
            <Text
              fw={600}
              c={colors.textPrimary}
              ta="center"
              style={{ fontSize: responsiveText.small }}
              truncate
            >
              {artist.name}
            </Text>
          </Box>
        </GlassCard>
      </UnstyledButton>

      {artist.proofImages?.length && (
        <Modal
          opened={proofOpen}
          onClose={() => setProofOpen(false)}
          title={`${artist.name} — Payment Confirmation`}
          size="lg"
          centered
          styles={{
            header: {
              background: "rgba(30, 30, 30, 0.95)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            },
            title: { color: colors.textPrimary, fontWeight: 600 },
            body: { background: "rgba(30, 30, 30, 0.95)", padding: 16 },
            content: {
              background: "rgba(30, 30, 30, 0.95)",
              border: "1px solid rgba(244, 93, 0, 0.15)",
            },
            close: { color: colors.textMuted },
          }}
        >
          <Stack gap="md">
            {artist.proofImages?.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Payment proof ${i + 1} for ${artist.name}`}
                radius="md"
                fit="contain"
              />
            ))}
          </Stack>
        </Modal>
      )}
    </>
  );
};

export default ArtistCard;
