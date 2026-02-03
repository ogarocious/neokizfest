import React from "react";
import { Stepper } from "@mantine/core";
import {
  IconMail,
  IconTicket,
  IconCash,
  IconShirt,
  IconPhone,
  IconMapPin,
  IconChecklist,
} from "@tabler/icons-react";
import { colors, responsiveText } from "../../styles/theme";
import type { RefundFormStep } from "../../types/refund";

interface FormProgressProps {
  currentStep: RefundFormStep;
  completedSteps: RefundFormStep[];
  requiredSteps: RefundFormStep[];
  onStepClick?: (step: RefundFormStep) => void;
}

const STEP_CONFIG: Record<
  RefundFormStep,
  { label: string; icon: React.FC<any> }
> = {
  email: { label: "Email", icon: IconMail },
  passDetails: { label: "Pass Details", icon: IconTicket },
  decision: { label: "Decision", icon: IconCash },
  shirt: { label: "Shirt", icon: IconShirt },
  contact: { label: "Contact", icon: IconPhone },
  shipping: { label: "Shipping", icon: IconMapPin },
  review: { label: "Review", icon: IconChecklist },
};

const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  completedSteps,
  requiredSteps,
  onStepClick,
}) => {
  const activeStepIndex = requiredSteps.indexOf(currentStep);

  return (
    <Stepper
      active={activeStepIndex}
      onStepClick={(index) => {
        if (onStepClick && index < activeStepIndex) {
          onStepClick(requiredSteps[index]);
        }
      }}
      styles={{
        root: {
          padding: "0 8px",
        },
        step: {
          padding: 0,
        },
        stepIcon: {
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(244, 93, 0, 0.4)",
          color: colors.primary,
          "&[data-completed]": {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            color: "white",
          },
          "&[data-progress]": {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            color: "white",
          },
        },
        stepCompletedIcon: {
          color: "white",
        },
        separator: {
          backgroundColor: "rgba(244, 93, 0, 0.2)",
        },
        stepLabel: {
          color: colors.textMuted,
          fontWeight: 500,
          fontSize: responsiveText.xs,
        },
      }}
      size="sm"
    >
      {requiredSteps.map((step) => {
        const config = STEP_CONFIG[step];
        const StepIcon = config.icon;

        return (
          <Stepper.Step
            key={step}
            label={config.label}
            icon={<StepIcon size={16} />}
            allowStepClick={completedSteps.includes(step)}
          />
        );
      })}
    </Stepper>
  );
};

export default FormProgress;
