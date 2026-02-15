import React from "react";
import { Head } from "@inertiajs/react";
import {
  Stack,
  Title,
  Text,
  Table,
  List,
  Box,
  Divider,
} from "@mantine/core";
import { colors, responsiveText } from "../styles/theme";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { GlassCard, AudioPlayer, ArticleMeta } from "../components/shared";

const bodyStyle: React.CSSProperties = {
  lineHeight: 1.8,
  fontSize: responsiveText.body,
};

const listBullet = (
  <Box
    style={{
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: colors.primary,
      flexShrink: 0,
      marginTop: 11,
    }}
  />
);

const ArticlePhoto: React.FC<{ src: string; caption: string }> = ({ src, caption }) => (
  <Box my="sm">
    <Box
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${colors.borderMuted}`,
      }}
    >
      <img
        src={src}
        alt={caption}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />
    </Box>
    <Text
      c={colors.textMuted}
      ta="center"
      mt="xs"
      style={{ fontSize: responsiveText.small, fontStyle: "italic" }}
    >
      {caption}
    </Text>
  </Box>
);

const sectionTitleStyle: React.CSSProperties = {
  color: colors.primary,
  fontSize: "clamp(1.125rem, 3.5vw, 1.5rem)",
};

const underlineAccent: React.CSSProperties = {
  textDecoration: "underline",
  textDecorationColor: colors.primary,
  textUnderlineOffset: "4px",
  textDecorationThickness: "2px",
};

const ChoosingMyself: React.FC = () => {
  return (
    <>
      <Head title="Choosing Myself">
        <meta name="description" content="The full story behind the end of Neo Kizomba Festival. 10 years of building, what it cost, and why I'm choosing myself." />
        <meta property="og:title" content="Choosing Myself — Neo Kizomba Festival" />
        <meta property="og:description" content="The full story behind the end of Neo Kizomba Festival. 10 years of building, what it cost, and why I'm choosing myself." />
        <meta property="og:image" content="/images/choosing-myself/hero.jpg" />
      </Head>
      <FarewellLayout>
      <Stack gap="xl" maw={800} mx="auto" px={{ base: "sm", sm: "md" }}>
        {/* Hero Banner + Meta */}
        <Stack gap="sm">
          <Box
            style={{
              borderRadius: 12,
              overflow: "hidden",
              marginTop: "clamp(8px, 2vw, 16px)",
            }}
          >
            <img
              src="/images/choosing-myself/hero.jpg"
              alt="The Neokiz Festival vs. Choosing Myself"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </Box>

          <ArticleMeta
            author="Charles Ogar"
            date="February 14, 2026"
            page="/choosing-myself"
            readTime="25 min read"
          />
        </Stack>

        <AudioPlayer
          src="/audio/choosing-myself.mp3"
          title="Listen to the Narration"
        />

        {/* The End */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            The End
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The Neo Kizomba Festival is ending. Not postponed. Over.
          </Text>
          <Text c={colors.textSecondary} style={bodyStyle}>
            This wasn't the plan. After 8 editions over 10 years, with a COVID
            gap that tested all of us, I never imagined writing these words
            under these circumstances, but here we are.
          </Text>
          <Text c={colors.textSecondary} style={bodyStyle}>
            And I'm writing them because{" "}
            <Text span style={underlineAccent} fw={700}>
              I'm choosing myself.
            </Text>
          </Text>
          <Text c={colors.textSecondary} style={bodyStyle}>
            For the first time in over a decade, I'm choosing my health, my
            peace, and my future over a scene that, on balance, took more than
            it gave back. This letter is my farewell to the festival. This is
            my truth, and my experience of things I endured over the past
            decade.
          </Text>
          <Text c={colors.textSecondary} style={bodyStyle}>
            This chapter of the festival is closed.
          </Text>
        </Stack>

        {/* TL;DR — commented out for now
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            TL;DR
          </Title>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8, alignItems: "flex-start" },
            }}
          >
            <List.Item>
              The Neo Kizomba Festival is ending. Not postponed. Over.
            </List.Item>
            <List.Item>
              The 6-month silence wasn't me running. I was dealing with anxiety,
              panic attacks, and needed time to resettle mentally and
              financially before I could address this properly.
            </List.Item>
            <List.Item>
              Everyone will be offered a refund, with public tracking so you can
              watch the progress. I could have ghosted. I'm not doing that.
            </List.Item>
            <List.Item>
              I paid 100% of my artists. Some payments were late because the
              festival didn't generate enough to cover everything immediately,
              not because I was pocketing money.
            </List.Item>
            <List.Item>
              I have two open-heart surgeries and a mechanical heart valve. I
              was putting off basic healthcare because all my money was tied up
              in the festival. Now I must choose my health.
            </List.Item>
            <List.Item>
              The model is broken. Organizers carry 250 to 400 times the
              financial risk of attendees, often with no reward. If the scene
              doesn't change how it supports the people who build these spaces,
              there won't be spaces to dance in.
            </List.Item>
            <List.Item>
              To those who genuinely showed up, volunteered, promoted without
              being asked, and checked in: thank you. You know who you are.
            </List.Item>
          </List>
        </Stack>
        */}

        {/* What We Built */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            What We Built
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Before I get into the harder parts, I want to honor what the Neo Kizomba
            Festival was. Because it was something.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            We did things very few others were doing:
          </Text>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8, alignItems: "flex-start" },
            }}
          >
            {/* Education & Training */}
            <List.Item>
              Community & History Panels, real conversations about where this
              dance came from and where it's going
            </List.Item>
            <List.Item>
              4 Show Your Styles with Laurent, the first and only in the scene
            </List.Item>
            <List.Item>
              2 Advanced training sessions with JP and Steffy
            </List.Item>
            <List.Item>
              Three levels of classes throughout the festival, fundamentals
              through advanced, making Neokiz an entry point for everyone, not
              just the already-experienced
            </List.Item>
            <List.Item>
              Hour-and-a-half classes with 30-minute breaks in between, because
              we cared about the learning experience and giving attendees time
              to rest, decompress, and connect between sessions
            </List.Item>
            {/* Competitions */}
            <List.Item>The first-ever Urbankiz Jack & Jill (2019)</List.Item>
            <List.Item>The first Switch J&J</List.Item>
            <List.Item>
              J&J divisions, Novice, Intermediate, Advanced, giving competitors
              a real pathway
            </List.Item>
            {/* Dance Floor & Attendee Experience */}
            <List.Item>
              Active taxi dancers to help with lead/follow ratio
            </List.Item>
            <List.Item>
              Women's care packages, tampons, chapstick, patches, and ibuprofen,
              because details matter
            </List.Item>
            <List.Item>
              Airport pickup videos so you knew exactly where to go
            </List.Item>
            <List.Item>
              Feedback surveys after every edition, because I genuinely wanted
              to get better
            </List.Item>
          </List>

          <Text c={colors.textSecondary} style={bodyStyle}>
            People met partners at this festival. Made lifelong friends. Found a
            dance that changed them. Some people walked in not knowing what
            Urbankiz was and walked out with a new passion.{" "}
            <Text span fs="italic">
              That part was real, and I carry those memories with gratitude.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Some of my favorite memories:
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Working alongside Laurent was something special. He was a brother
            from another mother. We were shoulder to shoulder, trying to
            influence the scene in a positive direction. His intellectual
            approach to dance content,{" "}
            <Text span style={underlineAccent}>
              the way he used words to inspire and not tear people down, that
              resonated with me deeply.
            </Text> I miss that
            partnership. And that epic dance he had with Steffy at the
            first-ever Jack & Jill? I still watch that video and smile.
          </Text>

          <ArticlePhoto src="/images/choosing-myself/IMG_1555.jpg" caption="Show Your Style — Neo Kizomba Festival 2018" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            I genuinely loved the Jack & Jills. Watching dancers progress over
            the years, seeing someone compete at one level and come back
            stronger the next time, sometimes across multiple events. That
            growth was one of the most rewarding things to witness.
          </Text>

          <ArticlePhoto src="/images/choosing-myself/NKF_SA_75.jpg" caption="Running the Jack & Jill — Neo Kizomba Festival 2019" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            The fundamentals track was a personal joy. I knew a lot of people
            didn't have access to Urbankiz classes or weekly socials in their
            cities, so I tried to weave real learning opportunities into the
            festival. Giving newcomers a space where they could learn without
            being intimidated was something I cared about deeply.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That closing DJ set in 2024. Ninja handed me a drink, I was buzzed
            and in the zone, and the songs just came to me. Completely off the
            cuff. No plan. Just flow. I listen to that mix a lot still.{" "}
            <Text span fs="italic">
              That one stays with me.
            </Text>
          </Text>

          <ArticlePhoto src="/images/choosing-myself/L7407746-Enhanced-NR.jpg" caption="Social Floor — Neo Kizomba Festival 2024" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            The pool parties were a blast. And I'll never forget scheming to get
            Sarah into one of the rooms so the crowd could give her the applause
            she deserved for everything she was doing behind the scenes.{" "}
            <Text span fs="italic">
              That moment definitely mattered.
            </Text>
          </Text>

          <ArticlePhoto src="/images/choosing-myself/NKF_SA_28.jpg" caption="The Community — Neo Kizomba Festival 2018" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            I made it a point to treat artists better than I'd been treated at
            other festivals. Warm meals, not just pizza. Drinks and snacks
            throughout the day. Proper breakfasts.{" "}
            <Text span style={underlineAccent}>
              I made that a priority because I knew what it felt like to be on
              the other side and not feel seen or cared for.
            </Text>
          </Text>
        </Stack>

        {/* A Decade of Swimming Upstream */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            A Decade of Swimming Upstream
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I need to give you the full picture, because this didn't happen
            overnight.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Phase 1: The Early Years.
          </Text>
          <Text c={colors.textSecondary} style={bodyStyle}>
            When I first started investing in growing Urbankiz in the U.S., the
            resistance came from the traditionalists. I was bullied at events.
            Called out in posts. Dismissed for pushing a dance that didn't fit
            the mold. I kept building anyway.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Phase 2: The Growth Years.
          </Text>
          <Text c={colors.textSecondary} style={bodyStyle}>
            As Urbankiz started gaining some traction and legitimacy, the
            resistance shifted. North American artists boycotting the festival
            and my brand. No communication. No conversation. Just cut off. Lots
            of what felt like entitlement & hype publicly with very little
            substance. I kept building anyway.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Phase 3: Now.
          </Text>
          <Text c={colors.textSecondary} style={bodyStyle}>
            Public accusations. Gossip. The same pattern, just a different
            source.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Every single phase, I was doing the work of building something for
            the scene offline & online. And every single phase, the resistance
            came from the people who also benefited from what I was building.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              At some point, you have to ask yourself: how many times can you swim
              upstream before you drown?
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            I hit my limit.
          </Text>
        </Stack>

        {/* What I Carried */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            What I Carried
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Let me tell you what it actually took to keep this festival alive.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            At any given edition, I was:
          </Text>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8, alignItems: "flex-start" },
            }}
          >
            <List.Item>
              Running the festival (laying flooring, setting up sound, hotel
              negotiations, wristbands, coordinating flight and workshop
              schedules, and budgeting; Sarah was instrumental the last 4 editions)
            </List.Item>
            <List.Item>DJing</List.Item>
            <List.Item>Taxi dancing</List.Item>
            <List.Item>Taking professional photos</List.Item>
            <List.Item>Shooting and editing video</List.Item>
            <List.Item>Running the Jack & Jills</List.Item>
            <List.Item>Managing social media content</List.Item>
            <List.Item>Editing recap videos and promos</List.Item>
            <List.Item>Building and maintaining the website</List.Item>
          </List>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And that's just during the event. It doesn't include the months of
            stress & planning before or the work after.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I wasn't hoarding roles. Outside of Sarah, a few coordinators, and
            the volunteers who stepped up over the years,{" "}
            <Text span style={underlineAccent}>
              I was filling gaps that very few people would step up to fill.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And it wasn't just me.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I have a vivid memory of Sarah carrying a speaker to load in a car
            between venues. The speaker was taller than half her body. She was
            moving it by herself. And at least four or five DJs were sitting
            right there, watching her, not lifting a finger to help.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              That image says more about the entitlement culture around these
              events than any paragraph I could write.
            </Text>
          </GlassCard>

          <ArticlePhoto src="/images/choosing-myself/IMG_2318.jpg" caption="Saturday Night Shows — Neo Kizomba Festival 2018" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            Equipment needs to be moved. Floors need to be laid down. People
            need to be checked in. Cleanup needs to happen afterward. These are
            basic operational needs that come with putting on an event. And yet,
            organizers and the people closest to them are often left doing most
            to all of it while others sit back and turn a blind eye.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            If each person just picked up after themselves, it would lighten the
            load during clean up and tear down. But that simple level of
            consideration rarely happens in my experience.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            "Why didn't you just get help?"
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I didn't have the finances to build a team. And without finances,
            what's the pitch?
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            "Hey, want to join me on this project? It's a ton of work. High
            stress. I'll appreciate you, but the scene won't. You probably won't
            get any recognition for it. And little to no payment."
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Who's signing up for that? They can just buy a pass and enjoy the
            event on their own terms instead of sacrificing their time behind
            the scenes.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And if you're the main organizer, you're footing the bill for
            whatever's left over. Everyone else gets to enjoy the event. You
            get the invoice.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Building a team requires either money or a culture of genuine
            support. I didn't have the money, and the culture wasn't there.{" "}
            <Text span style={underlineAccent}>
              Not enough people were willing to roll up their sleeves and share
              the weight.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The earlier editions had coordinators who stepped up and carried
            real weight. The later editions had Sarah, who was involved in a
            large majority of the operation. There were volunteers too — but you
            can only ask so much of people who also came to enjoy the event.
            They deserve to take classes, compete in the Jack & Jills, and
            actually dance. And there's still a level of compensation involved
            — comped passes, hotel rooms, travel. Balancing that cost against
            how much work to ask of them, without overworking them, was always
            a tricky exchange. So the core of the planning, the financial risk,
            the year-round work between editions — that still fell on me. Not
            because I wanted to carry it all. Because there's a limit to what
            you can put on someone else's shoulders, and even that limited help
            still comes at a cost.
          </Text>
        </Stack>

        {/* What an Artist Sees, What an Organizer Carries */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            What an Artist Sees, What an Organizer Carries
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've been on both sides of this equation. I'm an artist who's been
            hired and traveled to festivals and weekenders. I understand
            firsthand how strenuous it is to work the social floor and maintain
            boundaries with attendees. I've always viewed my role on the social
            floor as an investment in the scene's growth.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            My biggest frustrations as a traveling artist came from
            disorganization. Waiting over an hour for airport pickup. Not
            getting proper food to sustain myself over a high energy demanding
            weekend. Missing meals because you were teaching a private or a
            class, and no one set aside a plate.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            There is no rulebook for these events. It's all underground, and
            every festival is different. Those experiences are why I made artist
            care a priority at the Neo Kizomba Festival.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            But here's what I also learned from being on both sides:
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Artists carry the least risk and receive the highest reward.
          </Text>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8, alignItems: "flex-start" },
            }}
          >
            <List.Item>Flight: covered</List.Item>
            <List.Item>Hotel: covered</List.Item>
            <List.Item>Food: covered</List.Item>
            <List.Item>Payment: guaranteed in most cases</List.Item>
            <List.Item>
              Private lessons: additional income organizers don't touch
            </List.Item>
            <List.Item>
              Some international headliners charge up to {"\u20AC"}500/hour for
              privates
            </List.Item>
            <List.Item>Worst case: they lose a booking</List.Item>
            <List.Item>They leave with net positive income</List.Item>
          </List>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              To put that in perspective: the average hourly wage in the United
              States is roughly $35 to $37. Even earning $50/hour puts you well
              above the national average. Some of these artists are charging{" "}
              {"\u20AC"}500/hour, which is roughly $540. That's more than most
              corporate executives make per hour.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Anyone can charge what they want. That's their right. But when those
            fees are being absorbed by organizers who are already operating at a
            loss, funded by personal credit, and working hundreds of unpaid
            hours, the math doesn't work. It's not sustainable unless you have
            deep pockets, a philanthropic mindset, or the ability to absorb
            financial losses. Most organizers trying to build
            something sustainable and keep it alive don't have those luxuries.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And if you were to count every hour an organizer puts into planning,
            promoting, negotiating, building, executing, and cleaning up, many
            of them are effectively working for free. Or worse, paying out of
            pocket for the "privilege" of doing it.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I don't know where this narrative came from that organizers are
            rolling in money. That has not been my experience, and from
            conversations with the majority of other organizers, it's not theirs
            either.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Attendees carry moderate risk.
          </Text>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8, alignItems: "flex-start" },
            }}
          >
            <List.Item>Pass, flight, and hotel</List.Item>
            <List.Item>Total exposure: $750 to $1,400</List.Item>
          </List>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Organizers carry the highest risk, often with no reward.
          </Text>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8, alignItems: "flex-start" },
            }}
          >
            <List.Item>Total exposure: $36,500 to $87,000+</List.Item>
            <List.Item>Personal credit on the line</List.Item>
            <List.Item>Reputation on the line</List.Item>
            <List.Item>Months of unpaid labor</List.Item>
            <List.Item>Paid last, or not at all</List.Item>
            <List.Item>
              Best case: minimum wage if you count all the hours
            </List.Item>
          </List>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Let me break that organizer number down for an international level
            festival at a hotel venue:
          </Text>

          <Box style={{ overflowX: "auto" }}>
            <Table
              striped
              stripedColor="rgba(244, 93, 0, 0.08)"
              highlightOnHover
              highlightOnHoverColor="rgba(244, 93, 0, 0.12)"
              styles={{
                table: {
                  color: colors.textSecondary,
                  fontSize: responsiveText.body,
                },
                thead: {
                  borderBottom: `2px solid ${colors.borderPrimary}`,
                },
                th: {
                  color: colors.primary,
                  fontWeight: 600,
                  fontSize: responsiveText.small,
                  padding: "clamp(8px, 2vw, 12px)",
                },
                td: {
                  color: colors.textSecondary,
                  padding: "clamp(8px, 2vw, 12px)",
                  fontSize: responsiveText.body,
                  lineHeight: 1.6,
                },
                tr: {
                  borderBottom: `1px solid ${colors.borderMuted}`,
                },
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Expense</Table.Th>
                  <Table.Th>Range</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Artist flights</Table.Td>
                  <Table.Td>$8,000 - $15,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Artist payments/fees</Table.Td>
                  <Table.Td>$10,000 - $20,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Artist food & meals</Table.Td>
                  <Table.Td>$2,000 - $4,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Artist housing</Table.Td>
                  <Table.Td>$3,000 - $6,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Hotel contract / meeting space</Table.Td>
                  <Table.Td>$5,000 - $15,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Penalty if room nights not hit</Table.Td>
                  <Table.Td>$2,000 - $10,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Audio/sound equipment</Table.Td>
                  <Table.Td>$2,000 - $5,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Dance floor</Table.Td>
                  <Table.Td>$4,500 - $6,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Social media / marketing</Table.Td>
                  <Table.Td>$500 - $2,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Website / ticketing fees</Table.Td>
                  <Table.Td>$500 - $1,500</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Photography / videography</Table.Td>
                  <Table.Td>$1,000 - $3,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Insurance</Table.Td>
                  <Table.Td>$500 - $1,000</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Miscellaneous</Table.Td>
                  <Table.Td>$500 - $1,500</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <Text span fw={700}>
                      Total
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text span fw={700}>
                      $36,500 - $87,000
                    </Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Box>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              The organizer carries 250 to 400 times the financial risk of the
              attendee. And that's just the money. It doesn't include the mental
              health toll, the strained relationships, or the lost sleep.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And yet, the organizer is the one expected to smile and deliver
            flawlessly. While artists complain it's hard. While some attendees
            post about their anxiety over a $100 to $200 pass.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            My intention is not to minimize anyone's experience. But I need the
            full picture to be visible. Because it feels like it rarely has
            been.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And since we're making the full picture visible, let me share
            another part of it.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            There's a narrative that organizers can be bullies. And I'm sure
            some can. But from my experience, that dynamic runs both ways.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've dealt with international artists who used intimidation,
            blackmail, and false claims to try to damage my reputation when
            things didn't go exactly their way. Artists who benefited from being
            flown in, housed, fed, and paid, and then turned around and
            threatened to trash the event privately/publicly if their demands
            weren't met.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That's not professionalism at all.{" "}
            <Text span style={underlineAccent}>It's bullying.</Text> And it's a dynamic
            that organizers often have to navigate while still trying to deliver
            a great experience for attendees and uphold their commitments to
            artists and attendees.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And organizers are expected to just absorb it. Smile through it.
            Keep it moving. Because if you speak up, you're the "difficult" one.
            You're the bully. Meanwhile, you're the one who put your credit on
            the line, spent months planning, and created the very opportunity
            they're trying to exploit.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I don't think most attendees or community members have any idea how
            much unnecessary conflict organizers navigate behind the scenes, on
            top of the financial stress, the logistics, and the pressure to
            deliver a flawless experience.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              There is either a profound naivete or a deep sense of entitlement
              when it comes to what it actually takes to pull off a well-run
              event. I'm not sure which one it is. But the gap between what
              people expect and what it costs to deliver is staggering.
            </Text>
          </GlassCard>
        </Stack>

        {/* The Golden Goose */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            The Golden Goose
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've been thinking about the fable of the Golden Goose.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            A goose lays golden eggs. The owner benefits. But instead of caring
            for the goose, the owner gets greedy, wants more, faster. Eventually
            kills the goose expecting to find all the gold inside. Finds
            nothing. And now there are no more golden eggs. Ever.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            That's what this feels like in some ways.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The festival created a trickle-down effect for everyone:
          </Text>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8, alignItems: "flex-start" },
            }}
          >
            <List.Item>Hotels made money from 400+ room nights</List.Item>
            <List.Item>Airlines made money from travelers flying in</List.Item>
            <List.Item>Restaurants made money from group dinners</List.Item>
            <List.Item>Floor vendors and sound vendors got paid</List.Item>
            <List.Item>
              Artists got flown in, housed, fed, and paid, plus private lesson
              income
            </List.Item>
            <List.Item>
              Attendees got the experience, the memories, and the connections
            </List.Item>
          </List>

          <ArticlePhoto src="/images/choosing-myself/NKF_Fr-71.jpg" caption="Social Dancing — Neo Kizomba Festival 2019" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            All of that was built on the work the team and I were doing. We
            created the ecosystem. The platform. The thing that made everything
            else possible.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The Jack & Jill divisions gave competitors a real pathway — novice,
            intermediate, advanced. Placing in those divisions gave dancers
            credibility they could carry with them. Results that ended up in
            bios, on social media, at other events. That came from this
            platform.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            DJs and teachers looked to the Neo Kizomba Festival as a stamp of
            approval. I can't tell you how many people messaged me about
            wanting to teach or DJ at the festival. Being on the lineup carried
            weight. It was something people wanted on their resume.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            When things were good, everybody wanted to ride in the limo. Now,
            in this time of need — the equivalent of standing at the bus stop
            in the rain — ask me where those artists are.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              Everyone wanted to pick the fruit. But nobody was watering the
              roots. The festival was bearing fruit for the whole scene —
              credibility, platforms, opportunities, income. But very few people
              thought about what it takes to keep the tree alive. You can't keep
              picking and never pour water back in. Eventually the tree stops
              growing. Eventually there's nothing left to pick.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Beyond the festival, I also built Where Can We Dance, a resource
            for the broader community to find events and connect. I hosted the
            Olympiads of Kizomba competitions, which gave dancers national and
            international titles. Both lost money. And the Olympiads still came
            with the expectation of flying winners to Europe to compete.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            All of these accomplishments ended up on people's bios, dance
            resumes, and social media profiles. If you looked at the
            credentials many dancers and artists carry today, you'd find that
            a significant number of them came directly from the platforms and
            opportunities I helped build over the past decade.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And not enough people asked: how do we sustain the person
            making all of this happen?
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The pressure was always: produce more, do more, make it bigger, make
            it better. But the support to match that pressure rarely came.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              You can't keep expecting golden eggs while starving the goose.
              Eventually it dies. And then there are no more eggs for anybody.
            </Text>
          </GlassCard>
        </Stack>

        {/* What "Community" Actually Means */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            What "Community" Actually Means
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The word "community" gets used a lot in the dance scene. I want to
            share what it means to me, based on my experience
            building something for this community for over a decade.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            "Community" isn't just showing up to dance and have a good time. It
            isn't just holding space. It isn't just offering an ear.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Community is holding weight.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            Not just presence, but collaboration. Not just listening, but
            lifting.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Imagine someone drowning in a pool. A well-meaning friend pulls up a
            chair and offers to listen to their experience drowning.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            You don't pull up a chair.{" "}
            <Text span style={underlineAccent}>
              You jump in. You throw them a life ring. You PULL them to safety.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That's what I needed. Not ears. Hands.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            When I shared that I was struggling, the thing people most often
            offered was someone to listen. I know that comes from a good place.
            That's human. That's habit.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            But being listened to wasn't what I needed.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span fw={700}>
              I didn't need someone near me. I needed someone with me.
            </Text>{" "}
            Someone willing to carry even a small corner of the load, even for a
            little while.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I asked friends from the community to reshare promos on social
            media. It was like pulling teeth.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I reached out to attendees who had great experiences for
            testimonials. A fair number didn't reply, said they would but
            didn't, or simply ghosted.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I asked artists to help promote. Very few did so consistently. The
            attitude was "that's your responsibility."
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            There wasn't an understanding that if we promote together, there are
            enough sales to keep the event alive, artists get paid, and I don't
            have to fall on my face.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span style={underlineAccent}>
              Every year I asked for feedback and sent surveys in order to
              continually improve.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            What about people checking in on me or the team? Very few people
            asked: "How are you all doing? Did you make money? Did you break
            even?"
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Some did. And to those people: I see you, and I'm grateful. But it
            unfortunately wasn't enough for the size of what we were carrying.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've seen what real community (at least from the outside) looks like
            at festivals in other dance styles. Fundraisers where people step up
            to donate. Nonprofits coming together to help with funding. People
            showing up to set up and tear down. Multiple organizers wearing
            multiple hats, everyone pitching in. Multiple members of the
            community financially sponsoring different parts of the event.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            That's sustained support. That's shared weight.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            That's not what I experienced at the scale I needed.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Here's what I hope the scene starts to understand: most events are
            not a business move. Unless the organizer has deep pockets and is
            throwing money at it for the sake of it, a festival is a labor of
            love. It exists for the benefit of the community.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            But if the community doesn't step up to support the thing that was
            built for them, eventually there won't be anything left to enjoy.
            The organizer isn't the one benefiting the most. The people
            dancing, making memories, and having the time of their lives —
            they're the ones benefiting the most. The artists, like I said
            before, carry the least risk and walk away with the highest reward.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            If those people don't see the event as something worth investing
            in — worth keeping alive — then the roots dry up, the engine
            stops, and there's nothing left for anybody.
          </Text>
        </Stack>

        {/* Building from Nothing */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            Building from Nothing
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Let me tell you about my career as an artist, though I feel I've
            been more of an educator.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Probably at least 50% of my bookings were self-hosted weekenders. I
            organized them myself, in cities across the United States, Canada,
            and South America. I wasn't waiting for someone to roll out the red
            carpet. I understood what I was trying to contribute to was a
            growing dance. I was building at the grassroots level.
          </Text>

          <ArticlePhoto src="/images/choosing-myself/NKF_SA_42.jpg" caption="Urban Kiz Class by Py & Sarah — Neo Kizomba Festival 2019" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            There aren't enough festivals to hire everyone. There are barely any
            festivals at all. And there are very few experienced true
            organizers. Most people running events are figuring it out as they
            go, bringing whatever skills they have from other industries or
            learning in real time.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I brought my organizational skills to help other organizers in their
            cities. People who didn't have marketing experience, didn't know how
            to make social media graphics, didn't do pre-workshop or
            post-workshop surveys, didn't have ticketing systems dialed in. I
            helped them. On top of being the talent. On top of being the
            photographer. Because there wasn't enough money to hire separate
            people for all of these roles.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Beyond the infrastructure, the scene's fixation on hype is/was
            fundamentally unsustainable.{" "}
            <Text span style={underlineAccent}>
              What is/was truly needed was a focus on pedagogy and established
              systems to provide a proper base for new dancers and growth to
              stronger dancers and teachers.
            </Text>{" "}
            The desire to be seen and to be cool ultimately clouded the
            foundational work required for sustainability.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span fw={700}>
              This created a culture of entertainers and consumers rather than
              students and teachers.
            </Text>{" "}
            <Text span style={underlineAccent}>
              And that made long-term growth nearly impossible.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Having invested as much time as I have into this scene over the past
            decade, through the intellectual dance content, the festivals, the
            weekenders, the pedagogy, leading the Facebook group, it is deeply
            disappointing to see that investment yield so little fruitful
            growth. Not disappointing in a passing sense. Disappointing in the
            way that grief is disappointing.{" "}
            <Text span fs="italic">
              You keep pouring into something hoping it'll grow, and eventually
              you run out of water.
            </Text>
          </Text>
        </Stack>

        {/* Grace in the Underground */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            Grace in the Underground
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Here's something I need the scene to sit with.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            This is an underground dance world, meaning it's not mainstream.
            There are no standards. No universities. No certificates. No
            degrees. Not when it comes to social dancing.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            There is no class for how to throw a social. No training on how to
            negotiate with a hotel. No certification for becoming an instructor.
            No degree program for performing, organizing, or running a festival.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Most of us are learning as we go. That's the reality.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            And yet, there's very little grace extended to the people doing the
            learning in real time, in public, with real money and real
            consequences.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Community is not perfect. Organizers are not perfect. Artists are
            not perfect. If that's the starting point, then the response to
            imperfection shouldn't be finger-pointing, name-calling, and public
            scrutiny. It should be curiosity. It should be dialogue.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            "How can we work through this?" "What would make this right for
            both sides?" "What can we do differently going forward?"
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Those are the questions I wish I heard more often. Instead, what
            I've seen too often is people who are quick to take offense, quick
            to point fingers, and slow to ask questions or seek solutions.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The dance world is a microcosm of the real world. It's diverse. Full
            of different perspectives, backgrounds, and opinions. The history
            underneath what we do is deep, complex, and still being uncovered.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And within that complexity, what I see too often are people who act
            like they have all the answers. People who are loud and quick to
            throw shade, but lack curiosity and empathy. People who make
            audacious claims to garner attention, but
            aren't prepared to listen, empathize, or work toward a solution.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            What I wish I saw more of: humble, curious, solution-oriented people
            who are willing to sit down, have a real conversation, and figure
            out how to move forward together in a way that everyone can feel
            good about.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span style={underlineAccent}>
              That's what I tried to contribute to building. That's what I hoped for. And too
              often, that's not what showed up.
            </Text>
          </Text>
        </Stack>

        {/* No Safety Net */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            No Safety Net
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Some organizers can afford to take a financial hit because they have
            a full-time job, a secondary business, family money, something that
            cushions the blow.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That was never my reality.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I was a dancepreneur and a freelancer. Dance and freelancing were
            my income. Teaching, DJing, organizing, and picking up freelance
            work; that was how I paid rent. That was how I kept my lights on
            and food on my table.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            When the festival lost money, that wasn't just "disappointing." That
            was me not eating properly for months. Delaying doctor's
            appointments. Lying awake calculating whether I could make rent.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And navigating all of this as a Black man in America added layers
            that most people in this scene may never fully understand.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Walking into whole rooms of white hotel executives and sales staff
            who definitely did not have my best interests in mind. Having to be
            twice as sharp just to not get taken advantage of.
            Fighting against predatory contracts with no leverage and no legal
            team.{" "}
            <Text span style={underlineAccent}>
              Going over every clause with a microscope because one
              misunderstood term could mean an unexpected $10,000 bill.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Very few people see that work. Very few know how many bad deals I
            walked away from. How many times I had to advocate for myself alone,
            just to get to a starting point where the event might be viable.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            When refunds were delayed, the majority assumption wasn't "he's
            struggling." It was anger, judgment, and suspicion. There was no
            benefit of the doubt, and as a Black man in America, that's a
            pattern I know all too well.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            For centuries, the exploitation of Black talent, labor, and
            excellence has been a cornerstone of oppressive systems. From the
            transatlantic slave trade, where African labor was forcibly
            extracted to build wealth for others, to predatory contracts that
            still target Black athletes, entertainers, and creatives today,
            these patterns persist.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span style={underlineAccent}>
              Black men have long faced the harshest scrutiny. We are glorified
              for our contributions to sports, music, and physical excellence,
              but simultaneously devalued when we are not providing access to
              that excellence.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            As a Black dance instructor, educator, artist, organizer, and
            creative, I found myself navigating these same systems of
            exploitation, just in different forms.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            I wasn't organizing the Neo Kizomba Festival as a passion project
            funded by some other career. I was trying to build something sustainable that could
            support my life. When it didn't work, I didn't have a safety net to
            fall back on.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That's the part people don't see.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            As we navigate more and more levels of awareness, privilege,
            intersectionality, and uncovering dark histories of systemic racism
            and their continued impacts today, none of that is disconnected from
            the festival that we were trying to create.
          </Text>
        </Stack>

        {/* My Roots in Austin */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            My Roots in Austin
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Local members here in Austin have gossiped and said I don't care
            about Austin.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Let me tell you about my history in Austin.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I went to elementary school here. Middle school here. My mom was
            born here. My grandmother, who has now passed, had three houses in
            East Austin.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Those houses are gone now. Lost to gentrification. Lost to the same
            forces that have been pushing Black Americans out of the
            neighborhoods they built, owned, and raised families in for
            generations.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            My family's story on my mom's side is the story of Black Austin. The
            displacement. Being priced out. Watching your legacy get erased
            while newcomers act like the history started when they arrived.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            I have roots here. Generational roots.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            So when someone spreads a rumor that I "don't care about Austin,"
            it's not just wrong. It's reckless. It's the kind of claim people
            make to vilify someone without knowing a single thing about them.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I didn't move here to throw parties. I grew up here. My family built
            here. And I tried to build something here too.
          </Text>
        </Stack>

        {/* The Accusations */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            The Accusations
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Let me address this directly:{" "}
            <Text span fw={700}>
              I paid 100% of my artists.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Were there times I was late? Yes. A small percentage. And the reason
            was simple; the festival didn't generate enough to cover everything
            immediately. I had to scramble. Book private lessons. Find income
            from somewhere else just to make sure everyone got paid.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I wasn't pocketing money. I was trying to gather funds because what
            the festival made didn't carry over. I needed time.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            If I were pocketing money, I would have used it to take care of my
            health. I would have seen my cardiologist more often. I would have
            seen a dentist. I would have taken care of my body, which was my
            mechanism for my primary source of income.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And that information got exploited. Twisted into a rumor that I
            "don't pay artists."
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Take a look at the artist page and the repeat artists who came back
            over the years. If they weren't getting paid, they wouldn't have
            come back for multiple editions.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I have receipts. I have proof. I have context for every situation.
            And I'll share that on the artist page so you can see for yourself.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Three particular issues come to mind when it comes to these
            accusations of not paying artists:
          </Text>

          <Stack gap="sm">
            {[
              "A situation where an artist didn't provide their payment information for a year and a half.",
              "A situation where an artist had legal issues that prevented them from obtaining an ESTA to enter the US. Flights were already purchased. We spent hours on the phone with airlines and absorbed roughly $1,500 in additional expenses scrambling to get them here — and they completely ignored the extra cost it took us to get them to the event.",
              "A situation where an artist was upset about losing a booking due to the festival's cancellation and still expected to be paid for work that never happened — while I was struggling to keep a roof over my head. Meanwhile, the majority of other artists were far more empathetic to the situation.",
            ].map((text, i) => (
              <Box key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(244, 93, 0, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                >
                  <Text size="sm" fw={600} c={colors.primary}>
                    {i + 1}
                  </Text>
                </Box>
                <Text c={colors.textSecondary} style={bodyStyle}>
                  {text}
                </Text>
              </Box>
            ))}
          </Stack>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              That last one is worth sitting with. When an organizer is drowning
              financially and has to cancel for mental health or financial
              reasons, and your response is to still have your hand out — zoom
              out. Who is the person hurting the most in that situation? This
              goes back to what I said earlier: artists carry the least risk and
              receive the highest reward. And even in a moment of genuine
              struggle, some still prioritized their lost income over the
              person who was falling apart trying to make it all work.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I will post about these in more detail later in a separate post. But
            the point is, there were documented issues that caused delays in
            payment. There was a history of attempts to resolve those issues.
            And there was context for why those issues existed in the first
            place.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            But I want to say something broader about accusations in this scene.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            In this age of AI-generated media and rapidly spreading narratives,
            it is a dangerous thing to operate on "guilty until proven
            innocent," especially when the accused is a Black man. Our
            demographic has historically faced the harshest sentences and
            penalties in this country.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            When someone makes a public claim with no proof, no documented
            attempts at resolution, no history shown, that's not accountability.{" "}
            <Text span fw={700}>
              That's gossip weaponized.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And when a community runs with those claims without asking a single
            question, without any discernment or maturity, you're not holding
            someone accountable. You're participating in a pile-on.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I would ask this: any time you see someone pointing a finger, ask
            yourself:{" "}
            <Text span style={underlineAccent}>
              before they pointed the finger, did they extend a helping hand?
            </Text>{" "}
            Did they show proof? Did they attempt to resolve it privately?
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            If the answer is no, be very careful about what you amplify.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Some of the loudest call-outs came from competing organizers. Ask
            yourself what they had to gain by tearing down another event. The
            oldest tactic: become the tallest building in town by demolishing
            everyone else's, instead of simply building something better.
          </Text>
        </Stack>

        {/* Why I'm Choosing Myself */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            Why I'm Choosing Myself
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I saw a comment: "The organizer only cares about himself and his
            finances."
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Yes. I finally do. If I don't take my own well-being into
            consideration, who else is going to?
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            With those finances, I went to the dentist and got an overdue
            checkup and cleaning. I went to my cardiologist and scheduled an
            overdue echocardiogram to ensure my heart is functioning properly
            with my mechanical aortic heart valve to live as long of a life that
            God will allow me.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              For those who may not be aware, I've had two open-heart surgeries.
              I have a mechanical aortic heart valve. The maintenance of that
              valve through cardiologist visits and blood-thinning medicine is
              vital to extending my quality of life.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle}>
            My father passed in 2022, which compounded the financial strain on
            my family. The cost of living has gone up. The pandemic hit right
            after my second surgery in 2020.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Those are things I had been putting off for years because all my
            money and risk was tied up in the festival. I wasn't able to take
            care of myself properly.{" "}
            <Text span style={underlineAccent}>
              Basic healthcare. Basic human maintenance.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            So yes, I care about my finances. Because with those finances, I'm
            able to take care of myself as a human being. I feel we are all
            entitled to that level of basic health care.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That's not greed. That's survival.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Not a yacht, not a new car, and no new jewelry, clothes, or shoes.
            Doctor visits, clothes, food, and rent.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Economic power determines our ability to resist. This isn't about
            prosperity; it's about survival in its most fundamental form.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            We cannot fight for the culture when we're fighting to keep our
            lights on. We cannot build community while dodging bill collectors.
            We cannot sustain this work when our bank accounts are empty.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I put the festival and the scene first for too long, and I'm paying
            the price for it. For my own sanity, for my own health, for my own
            life, I have to make a change.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I refuse to keep over-functioning for other people's entertainment
            while I can't afford to see a doctor. That's not "community." That's
            unsustainable.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            So I'm choosing myself.
          </Text>
        </Stack>

        {/* What Happens Now */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            What Happens Now
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I know it's been months. I owe you an explanation for the silence.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            After the cancellation, I was dealing with anxiety and panic
            attacks. Every time I posted anything, it was met with questioning
            I didn't have answers for, which made it harder to show up
            publicly.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I tried reaching out to people I thought could help me see this
            through. Multiple times. Multiple people. And every single one
            fell through.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I don't know if it was the complexity of everything, or the weight
            of it, but when people saw what was actually involved, they stepped
            back. Some said they'd help and didn't follow through. Some went
            quiet. The result was the same — I was back where I started, alone
            with all of it.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            A lot of people offered to listen. I appreciated that. But
            listening didn't handle the refunds. Listening didn't move anything
            forward. What I needed was someone willing to help me either run
            the event one more time or close it responsibly. That help never
            came. Not at the level I needed, despite how many times I asked.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That's part of how I got to this point.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I was also dealing with a grant situation that didn't operate with
            the transparency or integrity it should have. It put me in a legal
            chokehold that I am still fighting my way out of. I'll leave it at
            that for now, but it added a significant layer of stress to an
            already overwhelming situation.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I needed time to resettle. Emotionally, mentally, and financially. To
            get to a place where I could address this clearly, not reactively.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span fw={700}>
              The silence wasn't me running.
            </Text>{" "}
            It was me choosing myself to get through the darker days.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            If I had the mental capacity to respond sooner, I would have.
          </Text>

          <Text c={colors.textSecondary} style={{ ...bodyStyle, ...underlineAccent }} fs="italic">
            I'm sorry it took this long. Responding before I was ready, with
            the support I did not have, would have put me in a mental place I'm
            not sure I would have been able to come back from.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            People paid for something they didn't get. I'm not disappearing.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Everyone will be offered a refund, the choice to waive it, and/or
            the option to make a donation.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            There will be public tracking so you can watch the progress. This
            level of transparency matters to me.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            I could have ghosted. Others in this scene have. I'm not doing that.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Even now, the same skills and drive that built this festival are
            showing up in how I'm closing it. A custom-built refund and
            donation system with public accountability. An artist payment
            tracker I built in part because, as a Black man in this scene, my
            word alone was never going to be enough.{" "}
            <Text span style={underlineAccent}>
              These aren't the actions of someone cutting corners. This is what
              excellence under pressure looks like, even on the way out.
            </Text>
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            For my own sanity and well-being, I won't be sharing a payment
            schedule or promising a completion date. Refund timing will depend
            on my monthly income, my well-being, and Zelle's daily transfer
            limits. The progress tracker will show every step transparently.
          </Text>
        </Stack>

        {/* What's Next */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            What's Next
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I don't know.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The festival chapter is closed. I need to clear this from my life,
            financially, mentally, and emotionally.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            I need to heal. There's grief in this. I'm grieving something I
            invested in for over a decade.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            But I'm also proud.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I'm proud of what we built and the level of excellence the team and
            I maintained with limited funds and against all of these odds. The
            standard we set and the innovative ideas we brought to the scene.
            The way we built a platform for artists to share their work and get
            paid. The way we created a space for people to learn and grow. A
            place that was more than just an event, but a place where people
            could connect, share, and feel seen.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That's ours. No one can take that.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've been getting into event photography, a skill I brought to many
            events outside of my own to help grow the dance's online presence.
            I'm making improvements to WCWD, Learntokiz, and a new project
            called VidHive. I'm still very much loving coding and building.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've been playing more tennis, investing in my health, and spending
            more time with my two cats.
          </Text>

          <ArticlePhoto src="/images/choosing-myself/L7404266.jpg" caption="Jack & Jill Invitational: JP & Bruna — Neo Kizomba Festival 2023" />
        </Stack>

        {/* Thank You, Sarah */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            Thank You, Sarah
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Sarah was my right hand for the last four editions: 2019, 2022,
            2023, and 2024.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            She wasn't just helping. She was embedded in the operation.
          </Text>

          <ArticlePhoto src="/images/choosing-myself/sarah3.png" caption="Sarah — The Heart Behind the Scenes" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            She was in the hotel email threads, the artist chats, and the Notion
            workspace where we coordinated everything. She carried logistics
            that most people will never know about. Coordinating artist
            schedules, managing volunteers, tracking what needed to happen and
            when, pulling things together under enormous pressure. She did this
            while holding down her own life, her own responsibilities, her own
            stress.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            She worked too hard. To a fault. She gave more of herself than was
            sustainable, and I watched it take a toll. That's something I carry;
            knowing that the weight of what I was building landed on her in ways
            that weren't fair.
          </Text>

          <Text c={colors.textSecondary} style={{ ...bodyStyle, ...underlineAccent }} fs="italic">
            She didn't have to do any of it. She chose to. And she pushed
            herself to the edge for something she believed in.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I owe her. Not just gratitude, but financially. That is also on my
            list of matters to address. She sacrificed too much to walk away
            empty-handed.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Whatever Sarah needs to do for her own peace moving forward, she has
            every right to do it. She's earned that and then some.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "xl" }}>
            <Text
              c={colors.textSecondary}
              fw={700}
              style={{ ...bodyStyle, lineHeight: 1.8 }}
            >
              I want to be clear about something: the Neo Kizomba Festival was my
              project, my name, and my responsibility. The refunds are mine to
              handle. If you have questions or concerns about the refund
              process, bring them to me. Please do not tag, message, or direct
              refund inquiries to Sarah. She gave more than enough. Let her be.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle} fs="italic">
            Sarah, thank you. I see you. I see what you carried. You deserve
            every flower and every bit of peace that comes your way. I hope you
            know how much I appreciate you, and if you ever need anything, I'm
            only one call away.
          </Text>
        </Stack>

        {/* Final Words */}
        <Stack gap="sm">
          <Title order={3} fw={700} style={sectionTitleStyle}>
            Final Words
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            To those who genuinely showed up over the years, who volunteered,
            who promoted without being asked, who checked in, who understood
            what this took: thank you. You know who you are, and I hope you know
            it mattered.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            To the scene: I hope this letter gives you a window into what it
            actually takes to build something. If events keep closing their
            doors and organizers keep burning out, it's not because they failed.
            It's because the model is broken, and I realize there are some
            organizers that are really the furthest thing from organized, and
            also there are just not enough people willing to roll up their
            sleeves to help build and sustain.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              If the community doesn't change how it supports the people who build
              these spaces, there simply won't be spaces to dance in. We're
              already seeing that unfold. If you want to dance, you have to care
              about the people who build the spaces you dance in. You have to care
              about their well-being, their mental health, their financial
              stability. You have to care about them as human beings, not just as
              entertainers or service providers.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            I gave what I had. For over a decade, I gave what I had.
          </Text>

          <Text c={colors.textSecondary} style={{ ...bodyStyle, ...underlineAccent }} fw={700} fs="italic">
            And now I'm choosing what's left of me.
          </Text>

          <ArticlePhoto src="/images/choosing-myself/intermediate competitors.jpeg" caption="Jack & Jill Intermediate Division Competitors — Neo Kizomba Festival 2023" />
        </Stack>

        {/* Footer Divider and Closing */}
        <Divider color={colors.borderPrimary} my="lg" />

        <Stack gap="md" align="center" ta="center">
          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span fw={700}>
              Neo Kizomba Festival.
            </Text>{" "}
            8 Editions. 10 Years. One legacy.
          </Text>

          <Text
            c={colors.textSecondary}
            style={{ ...bodyStyle, fontStyle: "italic" }}
          >
            When life gives you lemons, make lemonade.
          </Text>

          <Text
            c={colors.textSecondary}
            style={{ ...bodyStyle, fontStyle: "italic" }}
          >
            The same organizational skills, professionalism, coding ability, and
            thoughtfulness that I poured into building this festival over 10
            years, I'm now pouring into closing this chapter with as much
            integrity as I humanly can.
          </Text>

          <Text
            c={colors.textSecondary}
            style={{ ...bodyStyle, fontStyle: "italic" }}
          >
            From the inspired dancer who became an artist and organizer, and
            gave what he could for over a decade, who hoped his investments in
            the scene would yield growth that never came, to the person who is
            now choosing himself,
          </Text>

          <Text
            c={colors.textSecondary}
            fw={700}
            style={{ fontSize: responsiveText.large }}
          >
            Charles Ogar, "Mr. Neokiz"
          </Text>
        </Stack>
      </Stack>
    </FarewellLayout>
    </>
  );
};

export default ChoosingMyself;
