import React from "react";
import {
  Stack,
  Text,
  Title,
  SimpleGrid,
  Group,
  Badge,
  Box,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCode,
  IconBrandReact,
  IconBrandTypescript,
  IconServer,
  IconApi,
  IconDatabase,
  IconArrowDown,
  IconShieldLock,
  IconKey,
  IconTestPipe,
  IconForms,
  IconAlertTriangle,
  IconChartBar,
  IconSearch,
  IconMail,
  IconRefresh,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBulb,
  IconLayoutDashboard,
  IconHeartHandshake,
  IconExternalLink,
} from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import {
  GlassCard,
  PageHeader,
  BackToHome,
  GradientButton,
} from "../components/shared";
import { colors, responsiveText } from "../styles/theme";

const techStack = [
  {
    name: "Rails 8",
    description: "API layer, service objects, Action Mailer, encrypted credentials",
    icon: IconServer,
  },
  {
    name: "React 19",
    description: "Component-driven UI with hooks, state management, and form logic",
    icon: IconBrandReact,
  },
  {
    name: "TypeScript",
    description: "End-to-end type safety across all frontend components and data",
    icon: IconBrandTypescript,
  },
  {
    name: "Mantine 8.1",
    description: "Accessible component library with custom glassmorphism theme",
    icon: IconLayoutDashboard,
  },
  {
    name: "Inertia.js",
    description: "SPA-like routing without a separate API — server-driven, client-rendered",
    icon: IconBulb,
  },
  {
    name: "Notion API",
    description: "Database backend for refund requests, ticket holders, and chargebacks",
    icon: IconDatabase,
  },
];

const architectureSteps = [
  { label: "React Frontend", detail: "Mantine UI + TypeScript + Form Validation" },
  { label: "Inertia.js Bridge", detail: "Server-side routing, client-side rendering" },
  { label: "Rails Services", detail: "Email validation, refund creation, status lookup" },
  { label: "Notion Databases", detail: "Ticket holders, refund requests, chargebacks" },
];

const keyDecisions = [
  {
    title: "Privacy-First Architecture",
    description:
      "PII is sanitized server-side before reaching the frontend. Public pages like the progress dashboard never expose personal data — only aggregated stats.",
    icon: IconShieldLock,
  },
  {
    title: "Notion over SQL",
    description:
      "The festival team already lived in Notion. Instead of forcing a database migration, I built Rails service objects that speak the Notion API directly.",
    icon: IconDatabase,
  },
  {
    title: "Rails Encrypted Credentials",
    description:
      "API keys and secrets stored using Rails credentials — no .env files committed, no plain-text secrets in deployment configs.",
    icon: IconKey,
  },
  {
    title: "Mock-First Development",
    description:
      "Built the entire frontend against mock data first, then wired up Notion services. This let me iterate on UX without waiting on API integration.",
    icon: IconTestPipe,
  },
];

const featuresBuilt = [
  {
    title: "Multi-Step Refund Form",
    description:
      "Email validation, eligibility check, chargeback detection, and submission in a guided flow with step indicators.",
    icon: IconForms,
  },
  {
    title: "Chargeback Detection",
    description:
      "Cross-references a separate Notion database to automatically reject duplicate claims before they're submitted.",
    icon: IconAlertTriangle,
  },
  {
    title: "Progress Dashboard",
    description:
      "Real-time aggregate stats pulled from Notion — total requests, approved, pending, denied — with privacy-safe rendering.",
    icon: IconChartBar,
  },
  {
    title: "Status Lookup",
    description:
      "Ticket holders can check their refund status by email and confirmation number without exposing other users' data.",
    icon: IconSearch,
  },
  {
    title: "Action Mailer Integration",
    description:
      "Automated confirmation emails on submission with branded HTML templates and plain-text fallbacks.",
    icon: IconMail,
  },
  {
    title: "Cache-Busting Endpoint",
    description:
      "Shared-secret protected endpoint to refresh cached Notion data on demand — keeps the dashboard fresh without polling.",
    icon: IconRefresh,
  },
];

const BehindTheBuild: React.FC = () => {
  return (
    <FarewellLayout>
      <Stack
        gap="xl"
        maw={900}
        mx="auto"
        px={{ base: "sm", sm: "md" }}
        style={{ maxWidth: "100%" }}
      >
        {/* 1. Page Header */}
        <PageHeader
          icon={<IconCode size={36} color="white" />}
          title="Behind the Build"
          subtitle="A technical case study of the Neo Kizomba Festival refund system — from architecture decisions to production deployment."
        />

        {/* 2. Hero / Challenge */}
        <GlassCard variant="accent" p={{ base: "md", sm: "xl" }}>
          <Stack gap="md">
            <Title
              order={2}
              fw={700}
              c={colors.textPrimary}
              style={{ fontSize: responsiveText.sectionTitle }}
            >
              The Challenge
            </Title>
            <Text
              c={colors.textSecondary}
              style={{ fontSize: responsiveText.body, lineHeight: 1.7 }}
            >
              When the Neo Kizomba Festival was cancelled, over 200 ticket holders
              needed a transparent, secure way to request refunds. The festival team
              managed everything in Notion — so the solution had to integrate
              directly, not force a migration. I designed and built the entire system
              solo: a production-grade refund platform with email validation,
              chargeback detection, real-time progress tracking, and automated
              notifications.
            </Text>
            <Group gap="xs" mt="xs">
              <Badge
                variant="outline"
                color="orange"
                size="sm"
                style={{ borderColor: "rgba(244, 93, 0, 0.4)" }}
              >
                Solo Developer
              </Badge>
              <Badge
                variant="outline"
                color="orange"
                size="sm"
                style={{ borderColor: "rgba(244, 93, 0, 0.4)" }}
              >
                Full-Stack
              </Badge>
              <Badge
                variant="outline"
                color="orange"
                size="sm"
                style={{ borderColor: "rgba(244, 93, 0, 0.4)" }}
              >
                Production
              </Badge>
            </Group>
          </Stack>
        </GlassCard>

        {/* 3. Tech Stack */}
        <Stack gap="md">
          <Title
            order={2}
            fw={700}
            c={colors.textPrimary}
            ta="center"
            style={{ fontSize: responsiveText.sectionTitle }}
          >
            Tech Stack
          </Title>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="md">
            {techStack.map((tech) => (
              <GlassCard key={tech.name} variant="subtle" p="md">
                <Stack gap="xs">
                  <Group gap="sm">
                    <ThemeIcon
                      size={32}
                      radius="md"
                      variant="light"
                      color="orange"
                      style={{
                        background: "rgba(244, 93, 0, 0.12)",
                        border: "none",
                      }}
                    >
                      <tech.icon size={18} color={colors.primary} />
                    </ThemeIcon>
                    <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                      {tech.name}
                    </Text>
                  </Group>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.small, lineHeight: 1.5 }}>
                    {tech.description}
                  </Text>
                </Stack>
              </GlassCard>
            ))}
          </SimpleGrid>
        </Stack>

        {/* 4. Architecture Flow */}
        <Stack gap="md">
          <Title
            order={2}
            fw={700}
            c={colors.textPrimary}
            ta="center"
            style={{ fontSize: responsiveText.sectionTitle }}
          >
            Architecture Flow
          </Title>
          <GlassCard p={{ base: "md", sm: "xl" }}>
            <Stack gap={0} align="center">
              {architectureSteps.map((step, index) => (
                <React.Fragment key={step.label}>
                  <GlassCard
                    variant="subtle"
                    p="md"
                    style={{ width: "100%", maxWidth: 420 }}
                  >
                    <Stack gap={4} align="center">
                      <Text
                        fw={600}
                        c={colors.primary}
                        ta="center"
                        style={{ fontSize: responsiveText.body }}
                      >
                        {step.label}
                      </Text>
                      <Text
                        c={colors.textMuted}
                        ta="center"
                        style={{ fontSize: responsiveText.small }}
                      >
                        {step.detail}
                      </Text>
                    </Stack>
                  </GlassCard>
                  {index < architectureSteps.length - 1 && (
                    <Box py={6}>
                      <IconArrowDown size={20} color={colors.primary} />
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Stack>
          </GlassCard>
        </Stack>

        {/* 5. Key Decisions */}
        <Stack gap="md">
          <Title
            order={2}
            fw={700}
            c={colors.textPrimary}
            ta="center"
            style={{ fontSize: responsiveText.sectionTitle }}
          >
            Key Decisions
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {keyDecisions.map((decision) => (
              <GlassCard key={decision.title} variant="subtle" p="md">
                <Stack gap="xs">
                  <Group gap="sm">
                    <ThemeIcon
                      size={32}
                      radius="md"
                      variant="light"
                      color="orange"
                      style={{
                        background: "rgba(244, 93, 0, 0.12)",
                        border: "none",
                      }}
                    >
                      <decision.icon size={18} color={colors.primary} />
                    </ThemeIcon>
                    <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                      {decision.title}
                    </Text>
                  </Group>
                  <Text c={colors.textMuted} style={{ fontSize: responsiveText.small, lineHeight: 1.6 }}>
                    {decision.description}
                  </Text>
                </Stack>
              </GlassCard>
            ))}
          </SimpleGrid>
        </Stack>

        {/* 6. Features Built */}
        <Stack gap="md">
          <Title
            order={2}
            fw={700}
            c={colors.textPrimary}
            ta="center"
            style={{ fontSize: responsiveText.sectionTitle }}
          >
            Features Built
          </Title>
          <Stack gap="sm">
            {featuresBuilt.map((feature) => (
              <GlassCard key={feature.title} variant="subtle" p="md">
                <Group gap="md" wrap="nowrap" align="flex-start">
                  <ThemeIcon
                    size={36}
                    radius="md"
                    variant="light"
                    color="orange"
                    style={{
                      background: "rgba(244, 93, 0, 0.12)",
                      border: "none",
                      flexShrink: 0,
                    }}
                  >
                    <feature.icon size={20} color={colors.primary} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                      {feature.title}
                    </Text>
                    <Text c={colors.textMuted} style={{ fontSize: responsiveText.small, lineHeight: 1.6 }}>
                      {feature.description}
                    </Text>
                  </Stack>
                </Group>
              </GlassCard>
            ))}
          </Stack>
        </Stack>

        {/* 7. Where Can We Dance */}
        <GlassCard variant="accent" p={{ base: "md", sm: "xl" }}>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon
                size={40}
                radius="xl"
                variant="light"
                color="orange"
                style={{
                  background: "rgba(244, 93, 0, 0.12)",
                  border: "none",
                }}
              >
                <IconHeartHandshake size={22} color={colors.primary} />
              </ThemeIcon>
              <Title
                order={2}
                fw={700}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.sectionTitle }}
              >
                What's Next: Where Can We Dance
              </Title>
            </Group>

            <Text
              c={colors.textSecondary}
              style={{ fontSize: responsiveText.body, lineHeight: 1.8 }}
            >
              Years of organizing events and being deep in the dance scene
              exposed a lot of inefficiencies — booking private lessons,
              sharing artist travel schedules, giving organizers real
              visibility into what's happening across the community. These
              are problems I saw firsthand, and they're problems that
              software can solve.
            </Text>

            <Text
              c={colors.textSecondary}
              style={{ fontSize: responsiveText.body, lineHeight: 1.8 }}
            >
              After my second heart surgery, after the struggle of COVID
              and its devastating impact on in-person events and the
              financial reality of social dancing, I rolled up my sleeves
              and taught myself yet another skill. I started building
              software — not because it was easy, but because the scene
              needed it.
            </Text>

            <Text
              c={colors.textSecondary}
              style={{ fontSize: responsiveText.body, lineHeight: 1.8 }}
            >
              The skills demonstrated on this very site are being poured
              into{" "}
              <Text
                component="a"
                href="https://wherecanwedance.com"
                target="_blank"
                c={colors.primary}
                fw={600}
                style={{ textDecoration: "none" }}
              >
                Where Can We Dance
              </Text>
              {" "} — a platform built by a dancer, by an organizer, by an
              artist, for other artists, organizers, and dancers. The
              mission is simple: help the scene grow. Because right now,
              it's not growing.
            </Text>

            <GlassCard variant="subtle" p="md">
              <Text
                c={colors.textSecondary}
                style={{ fontSize: responsiveText.body, lineHeight: 1.8 }}
              >
                If we build software that helps organizers make money, they
                can keep organizing — and they can pay the artists. If the
                artists keep getting paid, they can keep growing in the
                scene and keep doing what they do. That means more dance
                events. And everybody wins.
              </Text>
            </GlassCard>

            <Text
              c={colors.textSecondary}
              style={{ fontSize: responsiveText.body, lineHeight: 1.8 }}
            >
              Even though I'm taking off my hat as the organizer of the
              Neo Kizomba Festival, I'm pouring more of my attention and
              experience into building software to solve these problems —
              from a less risky standpoint than carrying all the weight
              that came with the festival. This is how I continue to give
              back to the community I love.
            </Text>

            <Group justify="center" mt="xs">
              <GradientButton
                component="a"
                href="https://wherecanwedance.com"
                target="_blank"
                size="sm"
                leftSection={<IconExternalLink size={16} />}
              >
                Visit Where Can We Dance
              </GradientButton>
            </Group>
          </Stack>
        </GlassCard>

        {/* 8. CTA */}
        <GlassCard variant="accent" p={{ base: "md", sm: "xl" }}>
          <Stack align="center" gap="md">
            <Title
              order={2}
              fw={700}
              c={colors.textPrimary}
              ta="center"
              style={{ fontSize: responsiveText.sectionTitle }}
            >
              Interested in Working Together?
            </Title>
            <Text
              c={colors.textMuted}
              ta="center"
              maw={500}
              style={{ fontSize: responsiveText.body, lineHeight: 1.6 }}
            >
              I build production-grade web applications with modern tools and a
              focus on clean architecture. Let's connect.
            </Text>
            <Group gap="sm" mt="xs">
              <GradientButton
                component="a"
                href="https://github.com"
                target="_blank"
                size="sm"
                leftSection={<IconBrandGithub size={16} />}
              >
                GitHub
              </GradientButton>
              <GradientButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                size="sm"
                buttonVariant="outline"
                leftSection={<IconBrandLinkedin size={16} />}
              >
                LinkedIn
              </GradientButton>
            </Group>
          </Stack>
        </GlassCard>

        <BackToHome />
      </Stack>
    </FarewellLayout>
  );
};

export default BehindTheBuild;
