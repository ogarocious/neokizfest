import React from "react";
import { Group, Box, Text, Stack } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";

interface Step {
  key: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  /** Show labels below step circles on larger screens */
  showLabels?: boolean;
  /** Compact mode for mobile */
  compact?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  showLabels = true,
  compact = false,
}) => {
  const getStepStatus = (stepKey: string): "completed" | "current" | "upcoming" => {
    if (completedSteps.includes(stepKey)) return "completed";
    if (stepKey === currentStep) return "current";
    return "upcoming";
  };

  const stepSize = compact ? 28 : 32;
  const connectorHeight = compact ? 2 : 3;

  return (
    <Box py={compact ? "xs" : "sm"}>
      <Group justify="center" gap={0} wrap="nowrap">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.key}>
              <Stack align="center" gap={4}>
                {/* Step circle */}
                <Box
                  style={{
                    width: stepSize,
                    height: stepSize,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    ...(status === "completed" && {
                      background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.successLight} 100%)`,
                      boxShadow: `0 2px 8px rgba(34, 139, 34, 0.3)`,
                    }),
                    ...(status === "current" && {
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                      boxShadow: `0 2px 8px rgba(244, 93, 0, 0.3)`,
                    }),
                    ...(status === "upcoming" && {
                      background: colors.bgLight,
                      border: `2px solid ${colors.borderLight}`,
                    }),
                  }}
                >
                  {status === "completed" ? (
                    <IconCheck size={compact ? 14 : 16} color="white" stroke={3} />
                  ) : (
                    <Text
                      size={compact ? "xs" : "sm"}
                      fw={600}
                      c={status === "current" ? "white" : colors.textMuted}
                    >
                      {index + 1}
                    </Text>
                  )}
                </Box>

                {/* Step label (desktop only) */}
                {showLabels && !compact && (
                  <Text
                    ta="center"
                    style={{
                      fontSize: responsiveText.xs,
                      color: status === "current" ? colors.primary : colors.textMuted,
                      fontWeight: status === "current" ? 600 : 400,
                      maxWidth: 70,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.label}
                  </Text>
                )}
              </Stack>

              {/* Connector line */}
              {!isLast && (
                <Box
                  style={{
                    width: compact ? 24 : 40,
                    height: connectorHeight,
                    background:
                      completedSteps.includes(steps[index + 1]?.key) ||
                      steps[index + 1]?.key === currentStep
                        ? `linear-gradient(90deg, ${colors.success} 0%, ${colors.primary} 100%)`
                        : colors.bgLight,
                    marginTop: showLabels && !compact ? -20 : 0,
                    borderRadius: connectorHeight / 2,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Group>

      {/* Current step label (mobile compact mode) */}
      {compact && (
        <Text
          ta="center"
          mt="xs"
          style={{
            fontSize: responsiveText.small,
            color: colors.primary,
            fontWeight: 600,
          }}
        >
          {steps.find((s) => s.key === currentStep)?.label}
        </Text>
      )}
    </Box>
  );
};

export default StepIndicator;
