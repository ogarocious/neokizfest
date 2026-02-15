import React, { useEffect, useState } from "react";
import { Group, Text, Stack, Divider, ActionIcon, Tooltip, Box } from "@mantine/core";
import {
  IconEye,
  IconBrandFacebook,
  IconBrandX,
  IconBrandWhatsapp,
  IconMail,
  IconLink,
  IconCheck,
} from "@tabler/icons-react";
import { colors } from "../../styles/theme";

interface ArticleMetaProps {
  author: string;
  date: string;
  page: string;
  readTime?: string;
  shareUrl?: string;
  shareTitle?: string;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  author,
  date,
  page,
  readTime,
  shareUrl,
  shareTitle,
}) => {
  const [views, setViews] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const fullUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
  const title = shareTitle || document.title;

  useEffect(() => {
    fetch(`/api/stats/page-views?page=${encodeURIComponent(page)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.views > 0) setViews(data.views);
      })
      .catch(() => {});
  }, [page]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleShareX = () => {
    window.open(
      `https://x.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleShareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`,
      "_blank"
    );
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${fullUrl}`)}`;
  };

  return (
    <Stack gap={8}>
      {/* Byline row */}
      <Group justify="center" gap="xs" wrap="wrap">
        <Text c={colors.textMuted} size="sm">
          By <Text span fw={600} c={colors.textSecondary}>{author}</Text>
        </Text>
        <Text c={colors.textDim} size="sm">·</Text>
        <Text c={colors.textMuted} size="sm">{date}</Text>
        {readTime && (
          <>
            <Text c={colors.textDim} size="sm">·</Text>
            <Text c={colors.textMuted} size="sm">{readTime}</Text>
          </>
        )}
      </Group>

      {/* Stats + Share row */}
      <Group justify="center" gap="md" wrap="wrap">
        {views !== null && (
          <Group gap={5}>
            <IconEye size={15} color={colors.textMuted} />
            <Text c={colors.textMuted} size="sm">
              {views.toLocaleString()} views
            </Text>
          </Group>
        )}

        <Divider orientation="vertical" color={colors.borderMuted} size="sm" />

        <Group gap={4}>
          <Tooltip label="Share on Facebook" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleShareFacebook}
              aria-label="Share on Facebook"
            >
              <IconBrandFacebook size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share on X" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleShareX}
              aria-label="Share on X"
            >
              <IconBrandX size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share on WhatsApp" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleShareWhatsApp}
              aria-label="Share on WhatsApp"
            >
              <IconBrandWhatsapp size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share via email" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleShareEmail}
              aria-label="Share via email"
            >
              <IconMail size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={copied ? "Copied!" : "Copy link"} withArrow>
            <ActionIcon
              variant="subtle"
              color={copied ? "green" : "gray"}
              size="sm"
              onClick={handleCopyLink}
              aria-label="Copy link"
            >
              {copied ? <IconCheck size={16} /> : <IconLink size={16} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Box>
        <Divider color={colors.borderMuted} />
      </Box>
    </Stack>
  );
};

export default ArticleMeta;
