import React, { useState } from "react";
import { Group, Avatar, Text, Badge, ActionIcon, Modal, Image, Stack } from "@mantine/core";
import { IconEye, IconCheck, IconClock } from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import type { Artist } from "../../data/artistPaymentsData";

interface ArtistEntryProps {
  artist: Artist;
}

const ArtistEntry: React.FC<ArtistEntryProps> = ({ artist }) => {
  const [proofOpen, setProofOpen] = useState(false);

  return (
    <>
      <Group
        gap="sm"
        wrap="nowrap"
        py={8}
        px="xs"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        <Avatar
          src={artist.image}
          size={36}
          radius="md"
          color="orange"
          style={{
            flexShrink: 0,
            border: artist.confirmed
              ? "2px solid rgba(34, 139, 34, 0.5)"
              : "2px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {artist.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </Avatar>

        <Text
          fw={500}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.small, flex: 1, minWidth: 0 }}
          truncate
        >
          {artist.name}
        </Text>

        <Group gap={6} wrap="nowrap" style={{ flexShrink: 0 }}>
          <Badge
            size="sm"
            variant="light"
            color={artist.confirmed ? "green" : "gray"}
            leftSection={
              artist.confirmed ? (
                <IconCheck size={12} />
              ) : (
                <IconClock size={12} />
              )
            }
            style={{
              background: artist.confirmed
                ? "rgba(34, 139, 34, 0.15)"
                : "rgba(255, 255, 255, 0.05)",
              border: artist.confirmed
                ? "1px solid rgba(34, 139, 34, 0.3)"
                : "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {artist.confirmed ? "Confirmed" : "Pending"}
          </Badge>

          {artist.proofImages?.length && (
            <ActionIcon
              variant="subtle"
              color="orange"
              size="sm"
              onClick={() => setProofOpen(true)}
              style={{ background: "rgba(244, 93, 0, 0.1)" }}
            >
              <IconEye size={14} />
            </ActionIcon>
          )}
        </Group>
      </Group>

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

export default ArtistEntry;
