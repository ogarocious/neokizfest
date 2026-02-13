import React, { useState } from "react";
import {
  Paper,
  Stack,
  Text,
  Textarea,
  Button,
  Group,
  Loader,
} from "@mantine/core";
import { IconMessage, IconCheck } from "@tabler/icons-react";
import { colors, gradients } from "../../styles/theme";

const MAX_LENGTH = 1000;

interface CommunityMessageCardProps {
  identifier: string;
  type: "refund" | "donation";
}

const CommunityMessageCard: React.FC<CommunityMessageCardProps> = ({
  identifier,
  type,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/community-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type, message: message.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to save message. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Paper
        p={{ base: "md", sm: "lg" }}
        radius="md"
        style={{
          background: gradients.successCard,
          border: "1px solid rgba(34, 139, 34, 0.2)",
        }}
      >
        <Group gap="sm" align="center" justify="center">
          <IconCheck size={20} color={colors.success} />
          <Text fw={600} c={colors.success}>
            Message saved! It will appear on the progress page once reviewed.
          </Text>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper
      p={{ base: "md", sm: "lg" }}
      radius="md"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.borderLight}`,
      }}
    >
      <Stack gap="md">
        <Group gap="xs">
          <IconMessage size={20} color={colors.primary} />
          <Text fw={600} c={colors.textPrimary}>
            Leave a Message for the Community
          </Text>
        </Group>
        <Text size="sm" c={colors.textMuted} lh={1.6}>
          Want to share some words of support? Your message will appear
          anonymously (initials only) on the progress page once reviewed.
        </Text>

        <Textarea
          placeholder="Share your thoughts, encouragement, or memories..."
          value={message}
          onChange={(e) =>
            setMessage(e.currentTarget.value.slice(0, MAX_LENGTH))
          }
          minRows={3}
          maxRows={6}
          autosize
          autoComplete="off"
          styles={{
            input: {
              backgroundColor: "rgba(20, 20, 20, 0.8)",
              borderColor: "rgba(244, 93, 0, 0.3)",
              color: colors.textPrimary,
              fontSize: "1rem",
              "&::placeholder": { color: colors.textDim },
            },
          }}
        />

        <Group justify="space-between" align="center">
          <Text size="xs" c={colors.textDim}>
            {message.length}/{MAX_LENGTH}
          </Text>
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || loading}
            color="orange"
            size="sm"
            leftSection={
              loading ? (
                <Loader size="xs" color="white" />
              ) : (
                <IconMessage size={16} />
              )
            }
          >
            {loading ? "Sending..." : "Submit Message"}
          </Button>
        </Group>

        {error && (
          <Text size="sm" c={colors.error}>
            {error}
          </Text>
        )}
      </Stack>
    </Paper>
  );
};

export default CommunityMessageCard;
