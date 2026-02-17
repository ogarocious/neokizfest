import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { Stack, Text, Button, Drawer } from "@mantine/core";
import { IconFlower } from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { PageHeader, BackToHome } from "../components/shared";
import FlowerGallery from "../components/flowers/FlowerGallery";
import FlowerSubmissionForm from "../components/flowers/FlowerSubmissionForm";
import { artistTestimonials } from "../data/artistPaymentsData";
import { colors, responsiveText } from "../styles/theme";
import type {
  FlowersPageProps,
  FlowerEntry,
  CommunityMessageEntry,
} from "../types/flowers";

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
        id: (f as Record<string, unknown>).id as string,
        displayName: ((f as Record<string, unknown>).display_name ??
          (f as Record<string, unknown>).displayName) as string,
        contentType: ((f as Record<string, unknown>).content_type ??
          (f as Record<string, unknown>).contentType) as FlowerEntry["contentType"],
        message: (f as Record<string, unknown>).message as string | undefined,
        mediaUrl: ((f as Record<string, unknown>).media_url ??
          (f as Record<string, unknown>).mediaUrl) as string | undefined,
        source: (f as Record<string, unknown>).source as FlowerEntry["source"],
        dateSubmitted: ((f as Record<string, unknown>).date_submitted ??
          (f as Record<string, unknown>).dateSubmitted) as string,
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
    for (const cm of communityMessages) {
      const m = cm as unknown as CommunityMessageEntry;
      entries.push({
        id: m.id,
        displayName: m.display_name,
        contentType: "text",
        message: m.message,
        source: m.source as FlowerEntry["source"],
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
            subtitle="Memories, kind words, and love from the Neokiz attendees over the years."
          />

          {/* Share button */}
          <Button
            color="orange"
            leftSection={<IconFlower size={18} />}
            onClick={() => setDrawerOpen(true)}
            style={{ alignSelf: "flex-end" }}
          >
            Share a Flower
          </Button>

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
