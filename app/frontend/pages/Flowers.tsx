import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { Stack, Text, Button, Drawer, Group } from "@mantine/core";
import { IconFlower } from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { PageHeader, BackToHome } from "../components/shared";
import FlowerGallery from "../components/flowers/FlowerGallery";
import FlowerSubmissionForm from "../components/flowers/FlowerSubmissionForm";
import { artistTestimonials } from "../data/artistPaymentsData";
import { colors, responsiveText } from "../styles/theme";
import type { FlowersPageProps, FlowerEntry } from "../types/flowers";

const Flowers: React.FC<FlowersPageProps> = ({
  flowers,
  communityMessages,
  lastUpdated,
  cloudinaryCloudName,
  cloudinaryUploadPreset,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Merge all sources into a unified FlowerEntry array
  const allFlowers = useMemo(() => {
    const entries: FlowerEntry[] = [];

    // 1. Flowers from Notion (direct submissions + curated)
    for (const f of flowers) {
      entries.push({
        id: f.id,
        displayName: f.display_name,
        contentType: f.content_type as FlowerEntry["contentType"],
        message: f.message,
        mediaUrl: f.media_url,
        source: f.source as FlowerEntry["source"],
        dateSubmitted: f.date_submitted,
      });
    }

    // 2. Artist testimonials (hardcoded)
    for (const a of artistTestimonials) {
      entries.push({
        id: `artist-${a.name}`,
        displayName: a.name,
        contentType: "text",
        message: a.quote,
        imageUrl: a.image,
        role: a.role,
        source: "artist",
      });
    }

    // 3. Community messages from refund requests + donations (Notion)
    for (const m of communityMessages) {
      entries.push({
        id: m.id,
        displayName: m.display_name,
        contentType: "text",
        message: m.message,
        source: m.source as FlowerEntry["source"],
        donated: m.donated,
        dateSubmitted: m.date_submitted,
      });
    }

    return entries;
  }, [flowers, communityMessages]);

  const formatLastUpdated = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head title="Flowers">
        <meta
          name="description"
          content="Community flowers for the Neo Kizomba Festival — memories, kind words, and love."
        />
        <meta property="og:title" content="Flowers — Neo Kizomba Festival" />
        <meta
          property="og:description"
          content="Community flowers for the Neo Kizomba Festival — memories, kind words, and love."
        />
      </Head>
      <FarewellLayout>
        <Stack gap="lg" maw={900} mx="auto" px={{ base: "sm", sm: "md" }}>
          <PageHeader
            icon={<IconFlower size={32} color="white" />}
            title="Flowers"
            subtitle="Memories, kind words, and love from the Neokiz attendees, and urbankiz scene at large over the years."
          />

          {/* Share button + hint */}
          <Group justify="space-between" align="center">
            <Text c={colors.textDim} style={{ fontSize: responsiveText.xs }}>
              Text, photos, audio, or video welcome
            </Text>
            <Button
              color="orange"
              size="sm"
              leftSection={<IconFlower size={16} />}
              onClick={() => setDrawerOpen(true)}
            >
              Share a Flower
            </Button>
          </Group>

          {/* Gallery */}
          <FlowerGallery flowers={allFlowers} />

          {/* Submission Drawer */}
          <Drawer
            opened={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Share a Flower"
            position="right"
            size={420}
            styles={{
              header: {
                background: "rgba(15, 15, 15, 0.95)",
                borderBottom: "1px solid rgba(244, 93, 0, 0.15)",
              },
              title: {
                color: colors.textPrimary,
                fontWeight: 600,
              },
              body: {
                background: "rgba(15, 15, 15, 0.95)",
                paddingBottom: 24,
              },
              content: {
                background: "rgba(15, 15, 15, 0.95)",
              },
              close: {
                color: colors.textMuted,
              },
            }}
          >
            <FlowerSubmissionForm
              cloudName={cloudinaryCloudName}
              uploadPreset={cloudinaryUploadPreset}
              onSuccess={() => setDrawerOpen(false)}
            />
          </Drawer>

          {/* Last Updated */}
          <Text
            c={colors.textMuted}
            ta="center"
            style={{ fontSize: responsiveText.xs }}
          >
            Last updated: {formatLastUpdated(lastUpdated)} · Refreshes every
            hour
          </Text>

          <BackToHome />
        </Stack>
      </FarewellLayout>
    </>
  );
};

export default Flowers;
