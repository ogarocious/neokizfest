import React, { useState } from "react";
import {
  Stack,
  Text,
  Accordion,
  Group,
  Box,
} from "@mantine/core";
import {
  IconQuestionMark,
  IconCash,
  IconSettings,
  IconHeart,
  IconInfoCircle,
  IconBrandFacebook,
  IconList,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  PageHeader,
  BackToHome,
  GradientButton,
} from "../components/shared";
import { faqData, faqCategories, type FAQItem } from "../data/faqData";
import { colors } from "../styles/theme";

const CATEGORY_ICONS: Record<FAQItem["category"] | "all", React.FC<any>> = {
  all: IconList,
  refund: IconCash,
  process: IconSettings,
  support: IconHeart,
  general: IconInfoCircle,
};

const FAQ: React.FC = () => {
  const [category, setCategory] = useState<string>("all");

  const filteredFAQs =
    category === "all"
      ? faqData
      : faqData.filter((faq) => faq.category === category);

  return (
    <FarewellLayout>
      <Stack
        gap="xl"
        maw={800}
        mx="auto"
        px={{ base: "sm", sm: "md" }}
        style={{ maxWidth: "100%" }}
      >
        <PageHeader
          icon={<IconQuestionMark size={36} color="white" />}
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about the refund process and more."
        />

        {/* Category Filter */}
        <div
          className="hide-scrollbar"
          style={{
            paddingTop: 8,
            paddingBottom: 8,
            overflowX: "scroll",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              gap: 8,
              width: "max-content",
              padding: "8px 12px",
            }}
          >
            {faqCategories.map((cat) => {
              const isActive = category === cat.value;
              const Icon = CATEGORY_ICONS[cat.value as keyof typeof CATEGORY_ICONS];

              return (
                <Box
                  key={cat.value}
                  px="sm"
                  py={6}
                  onClick={() => setCategory(cat.value)}
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(244, 93, 0, 0.25) 0%, rgba(162, 90, 60, 0.3) 100%)"
                      : "rgba(255, 255, 255, 0.03)",
                    borderRadius: 20,
                    border: isActive
                      ? "1px solid rgba(244, 93, 0, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                  className="hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <Group gap={6} wrap="nowrap">
                    {Icon && (
                      <Icon
                        size={14}
                        color={isActive ? "#F45D00" : "#9A8F85"}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                    <Text
                      fw={isActive ? 600 : 500}
                      style={{
                        color: isActive ? "#F45D00" : "#9A8F85",
                        fontSize: "0.75rem",
                      }}
                    >
                      {cat.label}
                    </Text>
                  </Group>
                </Box>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion */}
        <GlassCard p={{ base: "sm", sm: "lg" }}>
          <Accordion
            variant="separated"
            styles={{
              item: {
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "12px",
                marginBottom: "8px",
                backdropFilter: "blur(10px)",
                "&[data-active]": {
                  backgroundColor: "rgba(244, 93, 0, 0.08)",
                  borderColor: "rgba(244, 93, 0, 0.2)",
                },
              },
              control: {
                padding: "12px 16px",
                "&:hover": {
                  backgroundColor: "rgba(244, 93, 0, 0.05)",
                },
              },
              chevron: {
                color: colors.primary,
                alignSelf: "center",
              },
              content: {
                padding: "0 12px 16px 12px",
              },
              label: {
                padding: 0,
              },
            }}
          >
            {filteredFAQs.map((faq) => {
              const CategoryIcon = CATEGORY_ICONS[faq.category];

              return (
                <Accordion.Item key={faq.id} value={faq.id}>
                  <Accordion.Control>
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <Box
                        style={{
                          width: 28,
                          height: 28,
                          minWidth: 28,
                          borderRadius: "50%",
                          background: "rgba(244, 93, 0, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CategoryIcon size={14} color={colors.primary} />
                      </Box>
                      <Text
                        fw={700}
                        c={colors.textPrimary}
                        style={{
                          flex: 1,
                          fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                          lineHeight: 1.4,
                          wordBreak: "break-word",
                        }}
                      >
                        {faq.question}
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text
                      c={colors.textSecondary}
                      style={{
                        lineHeight: 1.7,
                        paddingLeft: 36,
                        fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
                        wordBreak: "break-word",
                      }}
                    >
                      {faq.answer}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>

          {filteredFAQs.length === 0 && (
            <Text c={colors.textMuted} ta="center" py="xl">
              No questions found in this category.
            </Text>
          )}
        </GlassCard>

        {/* Still Have Questions */}
        <GlassCard variant="accent" p={{ base: "sm", sm: "lg" }}>
          <Stack align="center" gap={{ base: "xs", sm: "md" }}>
            <Text
              fw={600}
              c={colors.textPrimary}
              ta="center"
              style={{ fontSize: "clamp(0.85rem, 2.5vw, 1rem)" }}
            >
              Still have questions?
            </Text>
            <Text
              c={colors.textMuted}
              ta="center"
              maw={400}
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              Reach out to us on Facebook and we'll get back to you.
            </Text>
            <GradientButton
              component="a"
              href="https://www.facebook.com/NeoKizombaFest"
              target="_blank"
              size="sm"
              leftSection={<IconBrandFacebook size={16} />}
            >
              Contact Us
            </GradientButton>
          </Stack>
        </GlassCard>

        <BackToHome />
      </Stack>
    </FarewellLayout>
  );
};

export default FAQ;
