import React, { useState, useEffect } from "react";
import {
  Stack,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  SegmentedControl,
  Loader,
  Box,
} from "@mantine/core";
import { IconSend, IconFlower } from "@tabler/icons-react";
import FileUploader from "./FileUploader";
import { useFlowerSubmission } from "../../hooks/useFlowerSubmission";
import { colors, responsiveText, mobileInputStyles } from "../../styles/theme";
import type { FlowerContentType } from "../../types/flowers";

// Flower petals for the animation
const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  emoji: ["🌸", "🌺", "🌼", "🌷", "💐", "🌻"][i % 6],
  left: `${8 + Math.random() * 84}%`,
  delay: `${Math.random() * 1.5}s`,
  duration: `${2 + Math.random() * 1.5}s`,
  size: 16 + Math.random() * 16,
}));

interface FlowerSubmissionFormProps {
  cloudName: string;
  uploadPreset: string;
  onSuccess?: () => void;
}

const MEDIA_TYPES: FlowerContentType[] = ["image", "audio", "video"];

const FlowerSubmissionForm: React.FC<FlowerSubmissionFormProps> = ({
  cloudName,
  uploadPreset,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contentType, setContentType] = useState<FlowerContentType>("text");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { loading, uploading, submitted, error, submit } = useFlowerSubmission({
    cloudName,
    uploadPreset,
  });

  const needsFile = MEDIA_TYPES.includes(contentType);

  // Auto-close drawer after success animation
  useEffect(() => {
    if (submitted && onSuccess) {
      const timer = setTimeout(onSuccess, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, onSuccess]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const canSubmit = () => {
    if (!name.trim() || !email.trim() || !isValidEmail(email.trim())) return false;
    if (contentType === "text" && !message.trim()) return false;
    if (needsFile && !file) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!canSubmit() || loading) return;
    submit({
      name: name.trim(),
      email: email.trim(),
      contentType,
      message: message.trim() || undefined,
      file: needsFile ? file : null,
    });
  };

  const handleContentTypeChange = (v: string) => {
    setContentType(v as FlowerContentType);
    setFile(null);
  };

  if (submitted) {
    return (
      <Box
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 12,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        {/* Keyframe styles */}
        <style>{`
          @keyframes flowerFall {
            0% { opacity: 0; transform: translateY(-40px) rotate(0deg) scale(0.5); }
            20% { opacity: 1; transform: translateY(0px) rotate(30deg) scale(1); }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translateY(120px) rotate(180deg) scale(0.6); }
          }
          @keyframes flowerPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
        `}</style>

        {/* Falling petals */}
        {PETALS.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: p.left,
              top: 0,
              fontSize: p.size,
              animation: `flowerFall ${p.duration} ${p.delay} ease-in-out forwards`,
              pointerEvents: "none",
            }}
          >
            {p.emoji}
          </span>
        ))}

        {/* Center content */}
        <Stack align="center" gap="md" style={{ position: "relative", zIndex: 1 }}>
          <IconFlower
            size={48}
            color={colors.primary}
            style={{ animation: "flowerPulse 1.5s ease-in-out infinite" }}
          />
          <Text
            fw={700}
            c={colors.primary}
            ta="center"
            style={{ fontSize: responsiveText.sectionTitle }}
          >
            Thank you for your flower!
          </Text>
          <Text c={colors.textMuted} ta="center" size="sm">
            It will bloom in the garden once reviewed.
          </Text>
        </Stack>
      </Box>
    );
  }

  const captionLabel =
    contentType === "image"
      ? "Caption (optional)"
      : "Description (optional)";

  const captionPlaceholder =
    contentType === "image"
      ? "Add a caption to your image..."
      : contentType === "audio"
        ? "What is this audio about?"
        : "Describe your video...";

  const uploadingLabel =
    contentType === "video"
      ? "Uploading video..."
      : contentType === "audio"
        ? "Uploading audio..."
        : "Uploading...";

  return (
    <Stack gap="md">
      <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }} lh={1.6}>
        Share a memory, experience, or kind word about the Neo Kiz community.
        Your submission will appear after review.
      </Text>

      {/* Name + Email */}
      <TextInput
        label="Name"
        placeholder="Your first name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        required
        autoComplete="off"
        styles={mobileInputStyles}
      />
      <TextInput
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
        autoComplete="off"
        description="Only for admin contact — never shown publicly"
        error={email.trim() && !isValidEmail(email.trim()) ? "Please enter a valid email" : undefined}
        styles={mobileInputStyles}
      />

      {/* Content Type Selector */}
      <Stack gap={4}>
        <Text
          fw={500}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.small }}
        >
          What would you like to share?
        </Text>
        <SegmentedControl
          value={contentType}
          onChange={handleContentTypeChange}
          data={[
            { label: "Text", value: "text" },
            { label: "Image", value: "image" },
            { label: "Audio", value: "audio" },
            { label: "Video", value: "video" },
          ]}
          color="orange"
          fullWidth
          styles={{
            root: {
              backgroundColor: "rgba(20, 20, 20, 0.8)",
              border: "1px solid rgba(244, 93, 0, 0.2)",
            },
            label: {
              color: colors.textPrimary,
              fontSize: responsiveText.small,
              "&[data-active]": { color: "white" },
            },
          }}
        />
      </Stack>

      {/* Content Input */}
      {contentType === "text" && (
        <Textarea
          label="Your Message"
          placeholder="Share your memory, experience, or kind words..."
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value.slice(0, 2000))}
          minRows={3}
          maxRows={8}
          autosize
          required
          autoComplete="off"
          styles={mobileInputStyles}
        />
      )}

      {needsFile && (
        <Stack gap="xs">
          <FileUploader
            file={file}
            onFileSelect={setFile}
            contentType={contentType}
          />
          <Textarea
            label={captionLabel}
            placeholder={captionPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value.slice(0, 500))}
            minRows={2}
            maxRows={4}
            autosize
            autoComplete="off"
            styles={mobileInputStyles}
          />
        </Stack>
      )}

      {/* Submit */}
      <Group justify="flex-end">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit() || loading}
          color="orange"
          leftSection={
            loading ? (
              <Loader size="xs" color="white" />
            ) : (
              <IconSend size={16} />
            )
          }
        >
          {uploading ? uploadingLabel : loading ? "Sending..." : "Share Flower"}
        </Button>
      </Group>

      {error && (
        <Text size="sm" c={colors.error}>
          {error}
        </Text>
      )}
    </Stack>
  );
};

export default FlowerSubmissionForm;
