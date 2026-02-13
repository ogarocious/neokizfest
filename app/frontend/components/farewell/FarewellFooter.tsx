import React from "react";
import { Stack, Text, Group, Anchor, Container, Divider } from "@mantine/core";
import { IconBrandFacebook, IconHeart } from "@tabler/icons-react";
import { Link } from "@inertiajs/react";

const FarewellFooter: React.FC = () => {
  return (
    <Container size="lg" py="xl">
      <Divider mb="xl" color="rgba(244, 93, 0, 0.2)" />

      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap="xs">
            <Text fw={600} c="#F45D00">
              Neo Kizomba Festival
            </Text>
            <Text size="sm" c="#9A8F85" maw={300}>
              Thank you for being part of our journey. Your support over the
              years has meant everything to us.
            </Text>
          </Stack>

          <Stack gap="xs">
            <Text fw={600} size="sm" c="#E8E0D8">
              Quick Links
            </Text>
            <Group gap="lg">
              <Link href="/request" style={{ textDecoration: "none" }}>
                <Text size="sm" c="#9A8F85" className="hover:text-[#F45D00]">
                  Refund Request
                </Text>
              </Link>
              <Link href="/faq" style={{ textDecoration: "none" }}>
                <Text size="sm" c="#9A8F85" className="hover:text-[#F45D00]">
                  FAQ
                </Text>
              </Link>
              <Link href="/status" style={{ textDecoration: "none" }}>
                <Text size="sm" c="#9A8F85" className="hover:text-[#F45D00]">
                  Check Status
                </Text>
              </Link>
              <Link href="/behind-the-build" style={{ textDecoration: "none" }}>
                <Text size="sm" c="#9A8F85" className="hover:text-[#F45D00]">
                  Built With
                </Text>
              </Link>
            </Group>
          </Stack>

          <Stack gap="xs">
            <Text fw={600} size="sm" c="#E8E0D8">
              Contact Us
            </Text>
            <Anchor
              href="https://www.facebook.com/neokizfestival"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <Group gap="xs">
                <IconBrandFacebook size={18} color="#9A8F85" />
                <Text size="sm" c="#9A8F85" className="hover:text-[#F45D00]">
                  Facebook Page
                </Text>
              </Group>
            </Anchor>
          </Stack>
        </Group>

        <Divider color="rgba(244, 93, 0, 0.15)" />

        <Text ta="center" fs="italic" size="xs" c="#9A8F85" maw={460} mx="auto" lh={1.6}>
          "When life gives you lemons, make lemonade." — Every edition of
          the festival has been driven by a commitment to improve on the last.
          Even now, as we close this chapter, that spirit remains — applying my
          coding, systems thinking, and organizational skills to see it through
          the right way.
        </Text>

        <Group justify="center" gap="xs">
          <Text size="xs" c="#9A8F85">
            Made with
          </Text>
          <IconHeart size={14} color="#F45D00" fill="#F45D00" />
          <Text size="xs" c="#9A8F85">
            by Ogarocious
          </Text>
        </Group>
      </Stack>
    </Container>
  );
};

export default FarewellFooter;
