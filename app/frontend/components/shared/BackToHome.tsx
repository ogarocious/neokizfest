import React from "react";
import { Group, Text } from "@mantine/core";
import { Link } from "@inertiajs/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { colors } from "../../styles/theme";

interface BackToHomeProps {
  href?: string;
  label?: string;
}

const BackToHome: React.FC<BackToHomeProps> = ({
  href = "/",
  label = "Back to Home",
}) => {
  // Hide links that point to home
  if (href === "/") return null;

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Group gap="xs" justify="center">
        <IconArrowLeft size={16} color={colors.textMuted} />
        <Text
          size="sm"
          c={colors.textMuted}
          style={{
            transition: "color 0.2s ease",
          }}
          className="hover:text-[#F45D00]"
        >
          {label}
        </Text>
      </Group>
    </Link>
  );
};

export default BackToHome;
