import { useState, useCallback, useMemo } from "react";
import type {
  RefundFormState,
  RefundFormStep,
  PassHolder,
  RefundDecision,
  RefundPaymentMethod,
  ZelleInfo,
  WiseInfo,
  PaymentInfo,
  RefundRequestData,
} from "../types/refund";

const initialState: RefundFormState = {
  currentStep: "email",
  completedSteps: [],
  email: "",
  passHolder: null,
  decision: null,
  partialAmount: null,
  paymentMethod: null,
  zelleInfo: null,
  wiseInfo: null,
  calculatedRefund: 0,
  finalRefund: 0,
};

export function useRefundForm() {
  const [state, setState] = useState<RefundFormState>(initialState);

  // Calculate refund based on decision
  const calculatedRefund = useMemo(() => {
    if (!state.passHolder) return 0;

    switch (state.decision) {
      case "full":
        return state.passHolder.amountPaid;
      case "partial":
        return state.partialAmount || 0;
      case "waive":
        return 0;
      default:
        return 0;
    }
  }, [state.passHolder, state.decision, state.partialAmount]);

  // Final refund amount
  const finalRefund = calculatedRefund;

  // Determine which steps are needed based on form state
  const requiredSteps = useMemo((): RefundFormStep[] => {
    const steps: RefundFormStep[] = ["email", "passDetails", "decision"];

    // Contact step needed if getting a refund
    if (state.decision === "full" || state.decision === "partial") {
      steps.push("contact");
    }

    // Review step always last
    steps.push("review");

    return steps;
  }, [state.decision]);

  // Get step index for progress display
  const getStepIndex = useCallback(
    (step: RefundFormStep): number => {
      return requiredSteps.indexOf(step);
    },
    [requiredSteps]
  );

  // Total steps for progress
  const totalSteps = requiredSteps.length;
  const currentStepIndex = getStepIndex(state.currentStep);

  // Check if step can be navigated to
  const canNavigateToStep = useCallback(
    (step: RefundFormStep): boolean => {
      const stepIndex = requiredSteps.indexOf(step);
      if (stepIndex === -1) return false;

      // Can always go back to completed steps
      if (state.completedSteps.includes(step)) return true;

      // Can only go to next uncompleted step
      const currentIndex = requiredSteps.indexOf(state.currentStep);
      return stepIndex <= currentIndex + 1;
    },
    [requiredSteps, state.completedSteps, state.currentStep]
  );

  // Set email and pass holder (after validation)
  const setEmailValidated = useCallback((email: string, passHolder: PassHolder) => {
    setState((prev) => ({
      ...prev,
      email,
      passHolder,
      completedSteps: [...prev.completedSteps.filter((s) => s !== "email"), "email"],
      currentStep: "passDetails",
    }));
  }, []);

  // Confirm pass details
  const confirmPassDetails = useCallback(() => {
    setState((prev) => ({
      ...prev,
      completedSteps: [...prev.completedSteps.filter((s) => s !== "passDetails"), "passDetails"],
      currentStep: "decision",
    }));
  }, []);

  // Set refund decision
  const setDecision = useCallback((decision: RefundDecision, partialAmount?: number) => {
    setState((prev) => {
      const needsContact = decision === "full" || decision === "partial";

      return {
        ...prev,
        decision,
        partialAmount: decision === "partial" ? (partialAmount ?? null) : null,
        completedSteps: [...prev.completedSteps.filter((s) => s !== "decision"), "decision"],
        currentStep: needsContact ? "contact" : "review",
      };
    });
  }, []);

  // Set payment info (Zelle or Wise)
  const setPaymentInfo = useCallback((paymentInfo: PaymentInfo) => {
    setState((prev) => ({
      ...prev,
      paymentMethod: paymentInfo.method,
      zelleInfo: paymentInfo.zelle || null,
      wiseInfo: paymentInfo.wise || null,
      completedSteps: [...prev.completedSteps.filter((s) => s !== "contact"), "contact"],
      currentStep: "review",
    }));
  }, []);

  // Go back to a specific step
  const goToStep = useCallback(
    (step: RefundFormStep) => {
      if (canNavigateToStep(step)) {
        setState((prev) => ({
          ...prev,
          currentStep: step,
        }));
      }
    },
    [canNavigateToStep]
  );

  // Go to previous step
  const goBack = useCallback(() => {
    const currentIndex = requiredSteps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentStep: requiredSteps[currentIndex - 1],
      }));
    }
  }, [requiredSteps, state.currentStep]);

  // Reset form
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Get form data for submission
  const getSubmissionData = useCallback((): RefundRequestData | null => {
    if (!state.passHolder || !state.decision) return null;

    return {
      email: state.email,
      passType: state.passHolder.passType,
      amountPaid: state.passHolder.amountPaid,
      decision: state.decision,
      refundAmount: calculatedRefund,
      paymentMethod: state.paymentMethod || "zelle",
      zelleInfo: state.zelleInfo || undefined,
      wiseInfo: state.wiseInfo || undefined,
      finalRefundAmount: finalRefund,
      ticketHolderPageId: state.passHolder.notionPageId,
    };
  }, [state, calculatedRefund, finalRefund]);

  // Check if form is ready for submission
  const canSubmit = useMemo(() => {
    if (!state.passHolder || !state.decision) return false;

    // Need contact info if getting refund
    if (state.decision === "full" || state.decision === "partial") {
      if (!state.zelleInfo && !state.wiseInfo) return false;
    }

    return true;
  }, [state]);

  return {
    // State
    ...state,
    calculatedRefund,
    finalRefund,

    // Step info
    requiredSteps,
    totalSteps,
    currentStepIndex,

    // Actions
    setEmailValidated,
    confirmPassDetails,
    setDecision,
    setPaymentInfo,
    goToStep,
    goBack,
    reset,

    // Helpers
    canNavigateToStep,
    canSubmit,
    getSubmissionData,
  };
}

export type RefundFormHook = ReturnType<typeof useRefundForm>;
