import React, { useRef, useState } from "react";
import { Stack, Text, Group, Image, ActionIcon, Box } from "@mantine/core";
import {
  IconUpload,
  IconX,
  IconPhoto,
  IconMusic,
  IconVideo,
} from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import type { FlowerContentType } from "../../types/flowers";

const FILE_CONFIG: Record<
  string,
  { maxSize: number; accept: string[]; label: string; hint: string; icon: React.ReactNode }
> = {
  image: {
    maxSize: 10 * 1024 * 1024,
    accept: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    label: "an image",
    hint: "JPG, PNG, WebP, GIF — Max 10MB",
    icon: <IconPhoto size={24} />,
  },
  audio: {
    maxSize: 25 * 1024 * 1024,
    accept: ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm", "audio/ogg"],
    label: "an audio file",
    hint: "MP3, WAV, M4A, WebM, OGG — Max 25MB",
    icon: <IconMusic size={24} />,
  },
  video: {
    maxSize: 100 * 1024 * 1024,
    accept: ["video/mp4", "video/webm", "video/quicktime"],
    label: "a video",
    hint: "MP4, WebM, MOV — Max 100MB",
    icon: <IconVideo size={24} />,
  },
};

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  contentType: FlowerContentType;
  error?: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  onFileSelect,
  contentType,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const config = FILE_CONFIG[contentType] || FILE_CONFIG.image;

  const validateFile = (f: File): string | null => {
    if (!config.accept.includes(f.type)) {
      return `Please select a valid ${contentType} file.`;
    }
    if (f.size > config.maxSize) {
      return `File is too large. Maximum size is ${Math.round(config.maxSize / 1024 / 1024)}MB.`;
    }
    return null;
  };

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setLocalError(err);
      onFileSelect(null);
    } else {
      setLocalError(null);
      onFileSelect(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const remove = () => {
    onFileSelect(null);
    setLocalError(null);
  };

  const displayError = error || localError;

  // Preview for selected file
  if (file) {
    const isImage = contentType === "image";
    const isAudio = contentType === "audio";
    const isVideo = contentType === "video";
    const preview = isImage ? URL.createObjectURL(file) : null;

    return (
      <Stack gap="xs">
        <Box pos="relative">
          {isImage && preview && (
            <Image
              src={preview}
              alt="Preview"
              radius="md"
              mah={200}
              fit="cover"
              style={{ border: "1px solid rgba(255, 255, 255, 0.08)" }}
              onLoad={() => URL.revokeObjectURL(preview)}
            />
          )}
          {isAudio && (
            <Box
              p="md"
              style={{
                background: "rgba(20, 20, 20, 0.8)",
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <audio
                controls
                src={URL.createObjectURL(file)}
                style={{ width: "100%" }}
              />
            </Box>
          )}
          {isVideo && (
            <video
              controls
              src={URL.createObjectURL(file)}
              style={{
                width: "100%",
                maxHeight: 250,
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            />
          )}
          <ActionIcon
            size="sm"
            color="red"
            variant="filled"
            pos="absolute"
            top={8}
            right={8}
            onClick={remove}
            aria-label="Remove file"
          >
            <IconX size={14} />
          </ActionIcon>
        </Box>
        <Text size="xs" c={colors.textMuted}>
          {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
        </Text>
        {displayError && (
          <Text size="sm" c={colors.error}>
            {displayError}
          </Text>
        )}
      </Stack>
    );
  }

  // Drop zone
  return (
    <Stack gap="xs">
      <Box
        onDragOver={(e: React.DragEvent) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? colors.primary : "rgba(255, 255, 255, 0.12)"}`,
          borderRadius: 12,
          padding: "32px 16px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver
            ? "rgba(244, 93, 0, 0.05)"
            : "rgba(20, 20, 20, 0.5)",
          transition: "all 0.2s ease",
        }}
      >
        <Stack align="center" gap="xs">
          <Group gap="xs">
            {React.cloneElement(config.icon as React.ReactElement, {
              color: colors.textMuted,
            })}
            <IconUpload size={20} color={colors.textMuted} />
          </Group>
          <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
            Drag & drop {config.label} or click to browse
          </Text>
          <Text c={colors.textDim} style={{ fontSize: responsiveText.xs }}>
            {config.hint}
          </Text>
        </Stack>
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept={config.accept.join(",")}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {displayError && (
        <Text size="sm" c={colors.error}>
          {displayError}
        </Text>
      )}
    </Stack>
  );
};

export default FileUploader;
