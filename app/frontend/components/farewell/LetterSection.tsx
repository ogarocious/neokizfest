import React from "react";
import { Text, Stack, Title } from "@mantine/core";
import { colors, responsiveText } from "../../styles/theme";

interface LetterSectionProps {
  title?: string;
  content: string | string[];
  signature?: {
    name: string;
    title?: string;
  };
}

const LetterSection: React.FC<LetterSectionProps> = ({
  title,
  content,
  signature,
}) => {
  const paragraphs = Array.isArray(content) ? content : [content];

  return (
    <Stack gap="sm">
      {title && (
        <Title
          order={3}
          fw={600}
          style={{
            color: colors.primary,
            fontSize: "clamp(1rem, 3vw, 1.25rem)",
          }}
        >
          {title}
        </Title>
      )}

      {paragraphs.map((paragraph, index) => (
        <Text
          key={index}
          c={colors.textSecondary}
          style={{
            lineHeight: 1.8,
            fontStyle: "normal",
            fontSize: responsiveText.body,
          }}
        >
          {paragraph}
        </Text>
      ))}

      {signature && (
        <Stack gap={4} mt="md" align="flex-end">
          <Text fw={600} c={colors.primary}>
            {signature.name}
          </Text>
          {signature.title && (
            <Text style={{ fontSize: responsiveText.small }} c={colors.textMuted}>
              {signature.title}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default LetterSection;
