import React from "react";
import {
  Stack,
  Title,
  Text,
  Table,
  List,
  Box,
  Divider,
  Center,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { colors, responsiveText } from "../styles/theme";
import FarewellLayout from "../components/farewell/FarewellLayout";
import LetterSection from "../components/farewell/LetterSection";
import { GlassCard } from "../components/shared";

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
      marginTop: 10,
    }}
  />
);

const PhotoPlaceholder: React.FC<{ caption: string }> = ({ caption }) => (
  <Box
    my="sm"
    style={{
      background: "rgba(255, 255, 255, 0.02)",
      border: `1px dashed rgba(244, 93, 0, 0.25)`,
      borderRadius: 12,
      padding: "clamp(24px, 5vw, 40px) 16px",
    }}
  >
    <Center>
      <Stack gap={8} align="center">
        <IconPhoto size={32} color={colors.primary} style={{ opacity: 0.5 }} />
        <Text
          c={colors.textMuted}
          ta="center"
          style={{ fontSize: responsiveText.small }}
        >
          {caption}
        </Text>
      </Stack>
    </Center>
  </Box>
);

const sectionTitleStyle: React.CSSProperties = {
  color: colors.primary,
  fontSize: "clamp(1rem, 3vw, 1.25rem)",
};

const ChoosingMyself: React.FC = () => {
  return (
    <FarewellLayout>
      <Stack gap="xl" maw={800} mx="auto" px={{ base: "sm", sm: "md" }}>
        {/* Page Title */}
        <Title
          order={1}
          fw={700}
          ta="center"
          py={{ base: "md", sm: "xl" }}
          style={{
            color: colors.primary,
            fontSize: responsiveText.pageTitle,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          Neo Kizomba Festival vs. Choosing Myself
        </Title>

        {/* The End */}
        <LetterSection
          title="The End"
          content={[
            "Neo Kizomba Festival is ending. Not postponed. Over.",
            "This wasn't the plan. After 8 editions over 10 years, with a COVID gap that tested all of us, I never imagined writing these words under these circumstances, but here we are.",
            "But here I am. And I'm writing them because I'm choosing myself.",
            "For the first time in a decade, I'm choosing my health, my peace, and my future over a scene that took more than it gave back. This letter is my farewell, my truth, and my line in the sand.",
            "This chapter is closed.",
          ]}
        />

        {/* TL;DR */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            TL;DR
          </Title>

          <List
            icon={listBullet}
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
            }}
          >
            <List.Item>
              Neo Kizomba Festival is ending. Not postponed. Over.
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
              in the festival. I'm choosing my health.
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

        {/* What We Built */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            What We Built
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Before I get into the harder parts, I want to honor what Neo Kizomba
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
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
            }}
          >
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
            <List.Item>The first-ever Urbankiz Jack & Jill (2019)</List.Item>
            <List.Item>The first Switch J&J</List.Item>
            <List.Item>
              Three levels of classes throughout the festival, fundamentals
              through advanced, making Neokiz an entry point for everyone, not
              just the already-experienced
            </List.Item>
            <List.Item>
              Active taxi dancers to help with lead/follow ratio
            </List.Item>
            <List.Item>
              Women's care packages, tampons, chapstick, patches, ibuprofen,
              because details matter
            </List.Item>
            <List.Item>
              Airport pickup videos so you knew exactly where to go
            </List.Item>
            <List.Item>
              Feedback surveys after every edition, because I genuinely wanted
              to get better
            </List.Item>
            <List.Item>
              J&J divisions, Novice, Intermediate, Advanced, giving competitors
              a real pathway
            </List.Item>
          </List>

          <Text c={colors.textSecondary} style={bodyStyle}>
            People met partners at this festival. Made lifelong friends. Found a
            dance that changed them. Some people walked in not knowing what
            Urbankiz was and walked out with a new passion. That part was real,
            and I carry those memories with gratitude.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Some of my favorite memories:
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Working alongside Laurent was something special. He was a brother
            from another mother. We were shoulder to shoulder, trying to
            influence the scene in a positive direction. His intellectual
            approach to dance content, the way he used words to inspire and not
            tear people down, that resonated with me deeply. I miss that
            partnership. And that epic dance he had with Steffy at the
            first-ever Jack & Jill? I still watch that video and smile.
          </Text>

          <PhotoPlaceholder caption="Laurent & Steffy — First-ever Jack & Jill" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            I genuinely loved the Jack & Jills. Watching dancers progress over
            the years, seeing someone compete at one level and come back
            stronger the next time, sometimes across multiple events. That
            growth was one of the most rewarding things to witness.
          </Text>

          <PhotoPlaceholder caption="Jack & Jill Competitions" />

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
            cuff. No plan. Just flow. I listen to that mix and I dance. That one
            stays with me.
          </Text>

          <PhotoPlaceholder caption="2024 Closing DJ Set" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            The pool parties were a blast. And I'll never forget scheming to get
            Sarah into one of the rooms so the crowd could give her the applause
            she deserved for everything she was doing behind the scenes. That
            moment mattered.
          </Text>

          <PhotoPlaceholder caption="Pool Parties & Community Moments" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            From my experience, I treated artists better than I was ever treated
            at other festivals. Warm meals, not just pizza. Drinks and snacks
            throughout the day. Proper breakfasts. I made that a priority
            because I knew what it felt like to be on the other side.
          </Text>
        </Stack>

        {/* A Decade of Swimming Upstream */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            A Decade of Swimming Upstream
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I need to give you the full picture, because this didn't happen
            overnight.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span fw={700}>
              Phase 1: The Early Years.
            </Text>{" "}
            When I first started investing in growing Urbankiz in the U.S., the
            resistance came from the traditionalists. I was bullied at events.
            Called out in posts. Dismissed for pushing a dance that didn't fit
            the mold. I kept building anyway.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span fw={700}>
              Phase 2: The Growth Years.
            </Text>{" "}
            As Urbankiz started gaining some traction and legitimacy, the
            resistance shifted. North American artists boycotted the festival
            and my brand. No communication. No conversation. Just cut off. Lots
            of hype publicly with very little substance. I kept building anyway.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            <Text span fw={700}>
              Phase 3: Now.
            </Text>{" "}
            Public accusations. Gossip. Silence from people I invested in for
            years. The same pattern, just a different source.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Every single phase, I was doing the work of building something for
            the scene. And every single phase, the resistance came from the
            people who benefited from what I was building.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            At some point, you have to ask yourself: how many times can you swim
            upstream before you drown?
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            I hit my limit.
          </Text>
        </Stack>

        {/* What I Carried */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
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
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
            }}
          >
            <List.Item>
              Running the festival (laying flooring, setting up sound, hotel
              negotiations, wristbands, coordinating flight and workshop
              schedules, budgeting; Sarah was a huge help the last 4 editions)
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
            planning before or the work after.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I wasn't hoarding roles. I was filling gaps that nobody else would
            fill, at least not to the standard needed to keep the event alive.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And it wasn't just me.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I have a vivid memory of Sarah carrying a speaker between venues.
            The speaker was taller than half her body. She was moving it by
            herself. And at least four or five DJs were sitting right there,
            watching her, not lifting a finger to help.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That image says more about the culture around these events than any
            paragraph I could write.
          </Text>

          <PhotoPlaceholder caption="Behind the Scenes — Setting Up" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            Equipment needs to be moved. Floors need to be laid down. People
            need to be checked in. Cleanup needs to happen afterward. These are
            basic operational needs that come with putting on an event. And yet,
            organizers and the people closest to them are often left doing all
            of it while others sit back and wait for the red carpet to roll out.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            If each person just picked up after themselves, it would lighten the
            load significantly. But that level of consideration rarely showed up
            without being asked for.
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
            stress. Very little appreciation. You probably won't get credit for
            what you do. And there's no payment."
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Who's signing up for that? They can just buy a pass and enjoy the
            event on their own terms instead of sacrificing their time behind
            the scenes.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Building a team requires either money or a culture of genuine
            support. I didn't have the money, and the culture wasn't there. Not
            enough people were willing to share the weight.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            So I did it myself. Not because I wanted to. Because there was no
            other option.
          </Text>
        </Stack>

        {/* What an Artist Sees, What an Organizer Carries */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            What an Artist Sees, What an Organizer Carries
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've been on both sides of this equation. I'm an artist who's been
            hired and traveled to festivals. I understand firsthand how
            strenuous it is to work the social floor and maintain boundaries
            with attendees. I've always viewed my role on the social floor as an
            investment in the scene's growth.
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
            every festival is different. That experience is why I made artist
            care a priority at Neo Kizomba Festival.
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
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
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

          <Text c={colors.textSecondary} style={bodyStyle}>
            To put that in perspective: the average hourly wage in the United
            States is roughly $35 to $37. Even earning $50/hour puts you well
            above the national average. Some of these artists are charging{" "}
            {"\u20AC"}500/hour, which is roughly $540. That's more than most
            corporate executives make per hour.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Anyone can charge what they want. That's their right. But when those
            fees are being absorbed by organizers who are already operating at a
            loss, funded by personal credit, and working hundreds of unpaid
            hours, the math doesn't work. It's not sustainable unless you have
            deep pockets, a philanthropic mindset, or the ability to absorb
            financial hits indefinitely. Most organizers trying to build
            something sustainable and keep it alive don't have that luxury.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And if you were to count every hour an organizer puts into planning,
            promoting, negotiating, building, executing, and cleaning up, many
            of them are effectively working for free. Or worse, paying out of
            pocket for the privilege of doing it.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I don't know where this narrative came from that organizers are
            rolling in money. That has not been my experience, and from
            conversations with other organizers, it's not theirs either.
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
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
            }}
          >
            <List.Item>Pass, flight, hotel</List.Item>
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
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
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
            Let me break that organizer number down:
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

          <Text c={colors.textSecondary} style={bodyStyle}>
            The organizer carries 250 to 400 times the financial risk of the
            attendee. And that's just money. It doesn't include the mental
            health toll, the strained relationships, or the lost sleep.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And yet, the organizer is the one expected to smile and deliver
            flawlessly. While artists complain it's hard. While attendees post
            about their "anxiety" over a $100 to $200 pass.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I'm not minimizing anyone's experience. But I need the full picture
            to be visible. Because it rarely has been.
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
            threatened to trash the event publicly if their demands weren't met.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That's not professionalism. That's leverage disguised as grievance.
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
        </Stack>

        {/* The Golden Goose */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
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

          <Text c={colors.textSecondary} style={bodyStyle}>
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
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
            }}
          >
            <List.Item>Hotels made money from 400+ room nights</List.Item>
            <List.Item>Airlines made money from travelers flying in</List.Item>
            <List.Item>Restaurants made money from group dinners</List.Item>
            <List.Item>Floor vendors, sound vendors got paid</List.Item>
            <List.Item>
              Artists got flown in, housed, fed, paid, plus private lesson
              income
            </List.Item>
            <List.Item>
              Attendees got the experience, the memories, the connections
            </List.Item>
          </List>

          <PhotoPlaceholder caption="The Festival in Full Swing — Social Floor" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            All of that was built on the work the team and I were doing. We
            created the ecosystem. The platform. The thing that made everything
            else possible.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And not enough people asked: how do we sustain the person/team
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
          <Title order={3} fw={600} style={sectionTitleStyle}>
            What "Community" Actually Means
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            The word "community" gets used a lot in the dance scene. I want to
            talk about what it meant in practice.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            "Community" isn't just showing up to dance and have a good time. It
            isn't just holding space. It isn't just offering an ear.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            Community is holding weight.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Not just presence, but collaboration. Not just listening, but
            lifting.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Imagine someone drowning in a pool. A well-meaning friend pulls up a
            chair and offers to listen to their experience drowning.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            You don't pull up a chair. You jump in. You throw them a life ring.
            You PULL them to safety.
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
            Every year I asked for feedback. Sent surveys. Tried to improve.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Not once did enough people check in on me or the team. Very few
            people asked: "How are you all doing? Did you make money? Did you
            break even?"
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Some did. And to those people: I see you, and I'm grateful. But it
            wasn't enough for the size of what we were carrying.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I've seen what real community (at least from the outside) looks like
            at festivals in other dance styles. Fundraisers where people step up
            to donate. Nonprofits coming together to help with funding. People
            showing up to set up and tear down. Multiple organizers wearing
            multiple hats, everyone pitching in. Multiple members of the
            community fiscally sponsoring different parts of the event.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That's sustained support. That's shared weight.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That's not what I experienced at the scale I needed.
          </Text>
        </Stack>

        {/* Building from Nothing */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            Building from Nothing
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Let me tell you about my career as an artist, though I feel I've
            been more of an educator.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Probably at least 50% of my bookings were self-hosted weekenders. I
            organized them myself, in cities across the United States, Canada,
            South America. I wasn't waiting for someone to roll out the red
            carpet. I understood what I was trying to contribute to was a
            growing dance. I was building at the grassroots level.
          </Text>

          <PhotoPlaceholder caption="Grassroots Weekenders Across the U.S. & Beyond" />

          <Text c={colors.textSecondary} style={bodyStyle}>
            There aren't enough festivals to hire everyone. There are barely any
            festivals at all. And there are very few experienced organizers.
            Most people running events are figuring it out as they go, bringing
            whatever skills they have from other industries or learning in real
            time.
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
            Beyond the infrastructure, the scene's fixation on hype was
            fundamentally unsustainable. What was truly needed was a focus on
            pedagogy and established systems to provide a proper base for new
            dancers. The desire to be seen and to be cool ultimately clouded the
            foundational work required for sustainability.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            This created a culture of entertainers and consumers rather than
            students and teachers. And that made long-term growth nearly
            impossible.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            As one of the people who has invested the most time into this scene
            over the past decade, through the podcast, the festivals, the
            weekenders, the pedagogy, leading the Facebook group, it is deeply
            disappointing to see that investment yield so little fruitful
            growth. Not disappointing in a passing sense. Disappointing in the
            way that grief is disappointing.{" "}
            <Text span fs="italic">
              You pour into a vision for over ten years and watch the soil not
              take.
            </Text>
          </Text>
        </Stack>

        {/* Grace in the Underground */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            Grace in the Underground
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Here's something I need the scene to sit with.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            This is an underground dance world. There are no standards. No
            universities. No certificates. No degrees. Not when it comes to
            social dancing.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            There is no curriculum for how to throw a social. No training on how
            to negotiate with a hotel. No certification for becoming an
            instructor. No degree program for performing, organizing, or running
            a festival.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Every single one of us is learning as we go. That's the reality.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
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

          <Text c={colors.textSecondary} style={bodyStyle}>
            "What happened?" "How can we work through this?" "What would make
            this right for both of us?"
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
            like they have all the answers. People who are loud, but not
            curious. People who make audacious claims to garner attention, but
            aren't prepared to listen, empathize, or work toward a solution.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            What I wish I saw more of: humble, curious, solution-oriented people
            who are willing to sit down, have a real conversation, and figure
            out how to move forward together in a way that everyone can feel
            good about.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            That's what I tried to build. That's what I hoped for. And too
            often, that's not what showed up.
          </Text>
        </Stack>

        {/* No Safety Net */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            No Safety Net
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Let me be clear about something.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Some organizers can afford to take a financial hit because they have
            a full-time job, a partner with stable income, family money,
            something that cushions the blow.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That was never my reality.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I was a dancepreneur. Dance was my income. Teaching, DJing,
            organizing; that was how I paid rent. That was how I kept my lights
            on and food on my table.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            When the festival lost money, that wasn't "disappointing." That was
            me not eating properly for months. Delaying doctor's appointments.
            Lying awake calculating whether I could make rent.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And navigating all of this as a Black man in America added layers
            that most people in this scene may never fully understand.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Walking into rooms of white hotel owners and sales staff to
            negotiate contracts where the assumptions weren't in my favor.
            Having to be twice as sharp just to not get taken advantage of.
            Fighting against predatory contracts with no leverage and no legal
            team. Going over every clause with a microscope because one
            misunderstood term could mean an unexpected $10,000 bill.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Very few people see that work. Very few know how many bad deals I
            walked away from. How many times I had to advocate for myself alone,
            just to get to a starting point where the event might be viable.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            When refunds were delayed, the assumption wasn't "he's struggling."
            It was anger, judgment, and suspicion. There was no benefit of the
            doubt.
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
            Black men have long faced the harshest scrutiny. We are glorified
            for our contributions to sports, music, and physical excellence, but
            simultaneously devalued when we are not providing access to that
            excellence.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            As a Black dance instructor, educator, artist, organizer, and
            creative, I found myself navigating these same systems of
            exploitation, just in different forms.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I wasn't organizing Neo Kizomba as a passion project funded by some
            other career. I was trying to build something sustainable that could
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
          <Title order={3} fw={600} style={sectionTitleStyle}>
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
          <Title order={3} fw={600} style={sectionTitleStyle}>
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

          <Text c={colors.textSecondary} style={bodyStyle}>
            If I were pocketing money, I would have used it to take care of my
            health. I would have seen my cardiologist. I would have seen a
            dentist. I would have taken care of my body, which was my mechanism
            for my primary source of income.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            And that information got exploited. Twisted into a rumor that I
            "don't pay artists."
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Which is interesting, because I'm still getting contacted by artists
            who want to work with Neokiz. If I didn't pay people, why would they
            keep reaching out?
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I have receipts. I have proof. I have context for every situation.
            And I'll share that on the artist page so you can see for yourself.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Two particular issues come to mind when it comes to these
            accusations of not paying artists:
          </Text>

          <List
            type="ordered"
            spacing="xs"
            size="sm"
            styles={{
              root: { color: colors.textSecondary },
              itemWrapper: { fontSize: responsiveText.body, lineHeight: 1.8 },
            }}
          >
            <List.Item>
              A situation where an artist didn't provide their payment
              information for a year and a half.
            </List.Item>
            <List.Item>
              A situation where an artist's criminal record created issues with
              US entry, which affected flights we had already purchased and
              forced us to absorb additional expenses to fulfill the lineup we
              had promised.
            </List.Item>
          </List>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I will post about these in more detail later.
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
            yourself; before they pointed the finger, did they extend a helping
            hand? Did they show proof? Did they attempt to resolve it privately?
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
          <Title order={3} fw={600} style={sectionTitleStyle}>
            Why I'm Choosing Myself
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I saw a comment: "The organizer only cares about himself and his
            finances."
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Yes. I do.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            With those finances, I went to the dentist and got an overdue
            checkup. I went to my cardiologist and scheduled an overdue
            appointment to ensure my heart is functioning properly with my
            mechanical aortic heart valve to live as long of a life that God
            will allow me.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            For those who may not be aware, I've had two open-heart surgeries. I
            have a mechanical aortic heart valve. The maintenance of that valve
            through cardiologist visits and blood-thinning medicine is vital to
            extending my quality of life.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            My father passed in 2022, which compounded the financial strain on
            my family. The cost of living has gone up. The pandemic hit right
            after my second surgery in 2020.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Those are things I had been putting off for years because all my
            money and risk was tied up in the festival. I wasn't able to take
            care of myself properly. Basic healthcare. Basic human maintenance.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            So yes, I care about my finances. Because with those finances, I'm
            able to take care of myself as a human being.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That's not greed. That's survival.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Not a yacht, not a new car, no new jewelry, clothes, or shoes.
            Doctor visits, clothes, food, and rent.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Economic power determines our ability to resist. This isn't about
            prosperity; it's about survival in its most fundamental form.
          </Text>

          <GlassCard variant="accent" p={{ base: "md", sm: "lg" }}>
            <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
              We cannot fight for the culture when we're fighting to keep our
              lights on. We cannot build community while dodging bill
              collectors. We cannot sustain this work when our bank accounts are
              empty.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I put the festival and the scene first for too long, and I'm paying
            the price for it. For my own sanity, for my own health, for my own
            life, I have to make a change.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I refuse to keep over-functioning for other people's entertainment
            while I can't afford to see a doctor. That's not "community." That's
            exploitation with a smile.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            So I'm choosing myself.
          </Text>
        </Stack>

        {/* What Happens Now */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            What Happens Now
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I know it's been months. I owe you an explanation for the silence.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            After the cancellation, I was dealing with anxiety and panic
            attacks. Every time I posted anything, it was met with questioning
            that I just didn't have the answers to that made it harder to show
            up publicly. I tried reaching out to people I thought could help me
            see this through, and that didn't happen, which is part of how I got
            to this point.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I was also dealing with a grant situation that didn't operate with
            the transparency or integrity it should have. I'll leave it at that
            for now, but it added a significant layer of stress to an already
            overwhelming situation.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I needed time to resettle. Emotionally, mentally and financially. To
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

          <Text c={colors.textSecondary} style={bodyStyle}>
            I'm sorry it took this long. Responding before I was ready with the
            support I did not have would have put me in a mental place I wasn't
            sure I could come back from.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            People paid for something they didn't get. I'm not disappearing.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Everyone will be offered a refund, the choice to waive it, and/or
            making a donation.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            There will be public tracking so you can watch the progress. This
            level of transparency matters to me.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            I could have ghosted. Others in this scene have. I'm not doing that.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            For my own sanity and well-being, I won't be sharing a payment
            schedule or promising a completion date. Refund timing will depend
            on my monthly income and Zelle's daily transfer limits. The progress
            tracker will show every step transparently.
          </Text>
        </Stack>

        {/* What's Next */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            What's Next
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I don't know.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            This chapter is closed. I need to clear this from my life,
            financially, mentally, emotionally.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I need to heal. There's grief in this. I'm grieving something I
            invested in for over a decade.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            But I'm also proud.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I'm proud of the way I showed up. The level of excellence myself and
            the team maintained with limited funds and against all of these
            odds. The standard I set and innovative ideas I brought to the
            scene. The way I built a platform for artists to share their work
            and get paid. The way I created a space for people to learn and
            grow. The way we built a place that was more than just an event, but
            a place where people could connect, share, and feel seen.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            That's mine. No one can take that.
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

          <PhotoPlaceholder caption="What's Next — New Chapters" />
        </Stack>

        {/* Thank You, Sarah */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
            Thank You, Sarah
          </Title>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Sarah was my right hand for the last four editions: 2019, 2022,
            2023, and 2024.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            She wasn't just helping. She was embedded in the operation.
          </Text>

          <PhotoPlaceholder caption="Sarah — The Heart Behind the Scenes" />

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

          <Text c={colors.textSecondary} style={bodyStyle}>
            She didn't have to do any of it. She chose to. And she pushed
            herself to the edge for something she believed in.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I owe her. Not just gratitude, but financially. Any donations or
            extra contributions that come through this process will go toward
            making that right. She sacrificed too much to walk away
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
              I want to be clear about something: Neo Kizomba Festival was my
              project, my name, and my responsibility. The refunds are mine to
              handle. If you have questions or concerns about the refund
              process, bring them to me. Please do not tag, message, or direct
              refund inquiries to Sarah. She gave more than enough. Let her be.
            </Text>
          </GlassCard>

          <Text c={colors.textSecondary} style={bodyStyle}>
            Sarah, thank you. I see you. I see what you carried. You deserve
            every flower.
          </Text>
        </Stack>

        {/* Final Words */}
        <Stack gap="sm">
          <Title order={3} fw={600} style={sectionTitleStyle}>
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
            also there just not enough people are willing to roll up their
            sleeves to help build and sustain.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            If the community doesn't change how it supports the people who build
            these spaces, there simply won't be spaces to dance in. We're
            already seeing that.
          </Text>

          <Text c={colors.textSecondary} style={bodyStyle}>
            I gave what I had. For over a decade, I gave what I had.
          </Text>

          <PhotoPlaceholder caption="Neo Kizomba Festival — The Community We Built" />

          <Text c={colors.textSecondary} style={bodyStyle} fw={700}>
            And now I'm choosing what's left of me.
          </Text>
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
            gave what he could for over a decade who hoped his investment in the
            scene would yield growth, to the person who is now choosing himself,
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
  );
};

export default ChoosingMyself;
