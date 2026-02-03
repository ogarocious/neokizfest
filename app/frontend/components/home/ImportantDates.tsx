import {
  Container,
  Title,
  Paper,
  Text,
  Group,
  Avatar,
  Button,
  Badge,
  Stack,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendar, IconArrowRight } from "@tabler/icons-react";
import {
  ImportantDate,
  importantDatesData,
} from "../../data/importantDatesData";

import "@mantine/carousel/styles.css";

const ImportantDates = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const getCategoryColor = (category: ImportantDate["category"]) => {
    const colors = {
      "early-bird": "#F45D00",
      announcement: "#F19D58",
      tickets: "#EA580C",
      deadline: "#DC2626",
      community: "#7C3AED",
      travel: "#059669",
    };
    return colors[category] || "#6B7280";
  };

  const getButtonVariant = (variant: ImportantDate["button"]["variant"]) => {
    switch (variant) {
      case "urgent":
        return {
          background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
          color: "#FFFFFF",
        };
      case "primary":
        return {
          background: "linear-gradient(135deg, #F45D00 0%, #EA580C 100%)",
          color: "#FFFFFF",
        };
      case "secondary":
        return {
          background: "rgba(244, 93, 0, 0.1)",
          color: "#F45D00",
          border: "1px solid #F45D00",
        };
      default:
        return {};
    }
  };

  const getPriorityIndicator = (priority: ImportantDate["priority"]) => {
    if (priority === "high") {
      return (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#DC2626",
          }}
        />
      );
    }
    return null;
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
        padding: isDesktop ? "6rem 0" : "4rem 0",
        position: "relative",
      }}
    >
      <Container size="xl">
        <Stack gap="3rem">
          {/* Section Header */}
          <Group gap="8px" justify="flex-start">
            <div
              style={{
                width: "4px",
                height: "2rem",
                background: "linear-gradient(to bottom, #F45D00, #EA580C)",
                borderRadius: "2px",
              }}
            />
            <Title
              order={2}
              size={isDesktop ? "2.5rem" : "1.75rem"}
              c="#FFFFFF"
              fw={700}
              style={{
                fontFamily: "Poppins, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              Important Info
            </Title>
          </Group>

          {/* Cards Carousel */}
          <Carousel
            withIndicators
            height="auto"
            slideSize={{ base: "100%", sm: "50%", md: "50%" }}
            slideGap="xl"
            emblaOptions={{
              loop: true,
              dragFree: false,
              align: "start",
            }}
            controlsOffset="8px"
            styles={{
              control: {
                background: "linear-gradient(135deg, #F45D00 0%, #EA580C 100%)",
                border: "none",
                color: "#FFFFFF",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #EA580C 0%, #DC2626 100%)",
                },
              },
              indicator: {
                background: "rgba(244, 93, 0, 0.3)",
                "&[data-active]": {
                  background: "#F45D00",
                },
              },
            }}
          >
            {importantDatesData.map((item) => (
              <Carousel.Slide key={item.id}>
                <Paper
                  radius="lg"
                  p="44px"
                  h={400}
                  style={{
                    background:
                      "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
                    border: "1px solid rgba(75, 85, 99, 0.3)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 20px 40px rgba(244, 93, 0, 0.15)`,
                        borderColor: "rgba(244, 93, 0, 0.3)",
                      },
                    },
                  }}
                >
                  {getPriorityIndicator(item.priority)}

                  <Stack gap="lg" h="100%">
                    {/* Date and Category */}
                    <Group justify="space-between" align="flex-start">
                      <Group gap="xs">
                        <IconCalendar size={16} color="#f2f2f290" />
                        <Text size="sm" c="#f2f2f2" fw={500}>
                          {item.date}
                        </Text>
                      </Group>
                      <Badge
                        variant="light"
                        size="md"
                        style={{
                          background: `${getCategoryColor(item.category)}20`,
                          color: getCategoryColor(item.category),
                          border: `1px solid ${getCategoryColor(
                            item.category
                          )}40`,
                        }}
                      >
                        #
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1).replace("-", " ")}
                      </Badge>
                    </Group>

                    {/* Title */}
                    <Title
                      order={3}
                      size="1.25rem"
                      c="#FFFFFF"
                      fw={600}
                      lh={1.3}
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.title}
                    </Title>

                    {/* Description */}
                    <Text
                      c="#F2F2F2"
                      size="md"
                      lh={1.6}
                      style={{ flex: 1, overflow: "hidden" }}
                    >
                      {item.description.length > 180
                        ? `${item.description.substring(0, 120)}...`
                        : item.description}
                    </Text>

                    {/* Author and Button */}
                    <Group justify="space-between" align="center" mt="auto">
                      <Group gap="sm">
                        <Avatar
                          src={item.author.avatar}
                          size="sm"
                          radius="xl"
                          style={{ border: "2px solid rgba(244, 93, 0, 0.3)" }}
                        >
                          {item.author.name.charAt(0)}
                        </Avatar>
                        <Text size="xs" c="#9CA3AF" fw={500}>
                          {item.author.name}
                        </Text>
                      </Group>

                      <Button
                        size="xs"
                        rightSection={<IconArrowRight size={14} />}
                        style={getButtonVariant(item.button.variant)}
                        styles={{
                          root: {
                            fontSize: "0.75rem",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          },
                        }}
                      >
                        {item.button.text.length > 15
                          ? item.button.text.substring(0, 15) + "..."
                          : item.button.text}
                      </Button>
                    </Group>
                  </Stack>
                </Paper>
              </Carousel.Slide>
            ))}
          </Carousel>
        </Stack>
      </Container>
    </section>
  );
};

export default ImportantDates;
