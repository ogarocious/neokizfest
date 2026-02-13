import React, { useState } from "react";
import { Stack, Text, Box, Group, CloseButton } from "@mantine/core";
import { router } from "@inertiajs/react";
import { IconAlertCircle, IconTicket } from "@tabler/icons-react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { GlassCard, PageHeader, LoadingOverlay } from "../components/shared";
import FormProgress from "../components/refund/FormProgress";
import EmailStep from "../components/refund/EmailStep";
import PassDetailsStep from "../components/refund/PassDetailsStep";
import DecisionStep from "../components/refund/DecisionStep";
import ContactStep from "../components/refund/ContactStep";
import ReviewStep from "../components/refund/ReviewStep";
import { useRefundForm } from "../hooks/useRefundForm";
import { useRefundSubmission } from "../hooks/useApi";
import { colors, responsiveText } from "../styles/theme";
import type { PassHolder, RefundDecision, PaymentInfo, RefundFormStep } from "../types/refund";

const RefundRequest: React.FC = () => {
  const form = useRefundForm();
  const { submit, loading: isSubmitting } = useRefundSubmission();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [emailValidating, setEmailValidating] = useState(false);

  const handleEmailValidated = (email: string, passHolder: PassHolder) => {
    setEmailValidating(false);
    form.setEmailValidated(email, passHolder);
  };

  const handlePassDetailsConfirmed = () => {
    form.confirmPassDetails();
  };

  const handleDecision = (decision: RefundDecision, partialAmount?: number) => {
    form.setDecision(decision, partialAmount);
  };

  const handlePaymentInfo = (paymentInfo: PaymentInfo) => {
    form.setPaymentInfo(paymentInfo);
  };

  const handleEdit = (step: RefundFormStep) => {
    form.goToStep(step);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setSubmissionError(null);

    const data = form.getSubmissionData();
    if (!data) {
      setSubmissionError("Unable to prepare submission data. Please try again.");
      return;
    }

    try {
      const result = await submit(data);

      if (result.success && result.confirmationNumber) {
        // Navigate to confirmation page with data
        router.visit("/confirmation", {
          method: "get",
          data: {
            confirmationNumber: result.confirmationNumber,
            email: form.email,
            name: form.passHolder?.name || "",
            decision: form.decision,
            refundAmount: form.finalRefund,
            emailSent: result.emailSent !== false ? "true" : "false",
          },
        });
      } else {
        setSubmissionError(result.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setSubmissionError("An unexpected error occurred. Please try again.");
    }
  };

  const renderCurrentStep = () => {
    switch (form.currentStep) {
      case "email":
        return (
          <EmailStep
            onValidated={handleEmailValidated}
            initialEmail={form.email}
            onLoadingChange={setEmailValidating}
          />
        );

      case "passDetails":
        return form.passHolder ? (
          <PassDetailsStep
            passHolder={form.passHolder}
            onConfirm={handlePassDetailsConfirmed}
          />
        ) : null;

      case "decision":
        return form.passHolder ? (
          <DecisionStep
            passHolder={form.passHolder}
            onDecision={handleDecision}
          />
        ) : null;

      case "contact":
        return (
          <ContactStep
            onSubmit={handlePaymentInfo}
            initialMethod={form.paymentMethod}
          />
        );

      case "review":
        return form.passHolder && form.decision ? (
          <ReviewStep
            passHolder={form.passHolder}
            decision={form.decision}
            refundAmount={form.calculatedRefund}
            paymentMethod={form.paymentMethod}
            zelleInfo={form.zelleInfo}
            wiseInfo={form.wiseInfo}
            finalRefund={form.finalRefund}
            onEdit={handleEdit}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <FarewellLayout>
      <LoadingOverlay
        visible={emailValidating || isSubmitting}
        message={isSubmitting ? "Submitting your request..." : "Validating your email..."}
      />
      <Stack gap="lg" maw={700} mx="auto" px="md" style={{ maxWidth: "100%" }}>
        <PageHeader
          icon={<IconTicket size={28} color="white" />}
          title="Request Your Refund"
          subtitle="Complete the form below to submit your refund request."
        />

        <Text
          ta="center"
          fs="italic"
          c={colors.textMuted}
          style={{ fontSize: responsiveText.small, lineHeight: 1.6 }}
        >
          "When life gives you lemons, make lemonade." — Every edition of
          the festival has been driven by a commitment to improve on the last.
          Even now, as we close this chapter, that spirit remains — applying my
          coding, systems thinking, and organizational skills to see it through
          the right way.
        </Text>

        {/* Progress Indicator */}
        <div
          className="hide-scrollbar"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "4px 0",
            width: "100%",
          }}
        >
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          <Box style={{ minWidth: 480 }}>
            <FormProgress
              currentStep={form.currentStep}
              completedSteps={form.completedSteps}
              requiredSteps={form.requiredSteps}
              onStepClick={(step) => {
                if (form.canNavigateToStep(step)) {
                  form.goToStep(step);
                }
              }}
            />
          </Box>
        </div>

        {/* Form Container */}
        <GlassCard p="lg" mt="sm">
          {submissionError && (
            <GlassCard
              p="sm"
              mb="md"
              style={{
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
              }}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
                  <IconAlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <Text style={{ fontSize: responsiveText.small }} c={colors.textSecondary}>
                    {submissionError}
                  </Text>
                </Group>
                <CloseButton
                  size="sm"
                  onClick={() => setSubmissionError(null)}
                  style={{ color: "#DC2626" }}
                />
              </Group>
            </GlassCard>
          )}

          {renderCurrentStep()}
        </GlassCard>

        {/* Back Navigation (when not on first step) */}
        {form.currentStep !== "email" && (
          <Text
            c={colors.textMuted}
            ta="center"
            style={{
              cursor: "pointer",
              fontSize: responsiveText.small,
            }}
            onClick={() => form.goBack()}
            className="hover:text-[#F45D00]"
          >
            ← Go back to previous step
          </Text>
        )}
      </Stack>
    </FarewellLayout>
  );
};

export default RefundRequest;
