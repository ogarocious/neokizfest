import { useState, useCallback } from "react";
import type {
  EmailValidationResponse,
  RefundRequestData,
  RefundSubmissionResponse,
  StatusLookupRequest,
  StatusLookupResponse,
  ProgressData,
  PassHolder,
  MockPassHolderData,
} from "../types/refund";

// Environment variable check for mock mode
const USE_MOCK = import.meta.env.DEV || !import.meta.env.VITE_N8N_VALIDATE_EMAIL_URL;

// n8n webhook URLs (set in environment)
const N8N_VALIDATE_EMAIL_URL = import.meta.env.VITE_N8N_VALIDATE_EMAIL_URL || "";
const N8N_SUBMIT_REQUEST_URL = import.meta.env.VITE_N8N_SUBMIT_REQUEST_URL || "";
const N8N_CHECK_STATUS_URL = import.meta.env.VITE_N8N_CHECK_STATUS_URL || "";

// ==================== MOCK DATA ====================

const MOCK_PASS_HOLDERS: MockPassHolderData = {
  // ==================== VALID TICKET HOLDERS ====================

  // Full Pass - Standard case ($250)
  "john@example.com": {
    email: "john@example.com",
    name: "John Smith",
    passType: "full_pass",
    amountPaid: 250,
    purchaseDate: "2024-06-15",
    confirmationNumber: "NKF-2024-001234",
    hasChargeback: false,
  },

  // VIP Pass - Higher value ($450)
  "sarah@example.com": {
    email: "sarah@example.com",
    name: "Sarah Johnson",
    passType: "vip_pass",
    amountPaid: 450,
    purchaseDate: "2024-05-20",
    confirmationNumber: "NKF-2024-002345",
    hasChargeback: false,
  },

  // Party Pass - Lower value ($120)
  "mike@example.com": {
    email: "mike@example.com",
    name: "Mike Williams",
    passType: "party_pass",
    amountPaid: 120,
    purchaseDate: "2024-07-01",
    confirmationNumber: "NKF-2024-003456",
    hasChargeback: false,
  },

  // Workshop Pass - Mid value ($180)
  "emma@example.com": {
    email: "emma@example.com",
    name: "Emma Davis",
    passType: "workshop_pass",
    amountPaid: 180,
    purchaseDate: "2024-06-28",
    confirmationNumber: "NKF-2024-004567",
    hasChargeback: false,
  },

  // Artist Pass - Special case
  "artist@example.com": {
    email: "artist@example.com",
    name: "Alex Rivera",
    passType: "artist_pass",
    amountPaid: 0,
    purchaseDate: "2024-04-10",
    confirmationNumber: "NKF-2024-005678",
    hasChargeback: false,
  },

  // Edge case: Small amount (less than shirt price)
  "tiny@example.com": {
    email: "tiny@example.com",
    name: "Tim Iny",
    passType: "party_pass",
    amountPaid: 30,
    purchaseDate: "2024-08-01",
    confirmationNumber: "NKF-2024-006789",
    hasChargeback: false,
  },

  // Edge case: Exact shirt price amount
  "exact@example.com": {
    email: "exact@example.com",
    name: "Eve Xact",
    passType: "workshop_pass",
    amountPaid: 45,
    purchaseDate: "2024-07-15",
    confirmationNumber: "NKF-2024-007890",
    hasChargeback: false,
  },

  // ==================== ERROR CASES ====================

  // Chargeback user - Should be rejected
  "chargeback@example.com": {
    hasChargeback: true,
  } as any,
};

const MOCK_STATUS_DATA: { [key: string]: StatusLookupResponse["request"] } = {
  "NKF-REF-000001": {
    confirmationNumber: "NKF-REF-000001",
    status: "completed",
    decision: "full",
    refundAmount: 250,
    shirtOrdered: false,
    submittedAt: "2024-12-01T10:30:00Z",
    completedAt: "2024-12-05T14:20:00Z",
  },
  "NKF-REF-000002": {
    confirmationNumber: "NKF-REF-000002",
    status: "processing",
    decision: "partial",
    refundAmount: 150,
    shirtOrdered: true,
    shirtDetails: [{ size: "M", quantity: 1 }],
    submittedAt: "2024-12-03T09:15:00Z",
  },
  "NKF-REF-000003": {
    confirmationNumber: "NKF-REF-000003",
    status: "pending",
    decision: "waive",
    refundAmount: 0,
    shirtOrdered: true,
    shirtDetails: [{ size: "L", quantity: 2 }],
    submittedAt: "2024-12-04T16:45:00Z",
  },
};

const MOCK_PROGRESS_DATA: ProgressData = {
  stats: {
    totalRequests: 156,
    completedRefunds: 89,
    processingRefunds: 34,
    waivedRefunds: 23,
    totalRefundAmount: 18450,
    totalWaivedAmount: 5200,
  },
  recentCompletions: [
    { id: "NKF-REF-000089", initials: "JS", status: "completed", passType: "full_pass", amount: 250, completedAt: "2024-12-05T14:20:00Z" },
    { id: "NKF-REF-000088", initials: "MK", status: "completed", passType: "vip_pass", amount: 400, completedAt: "2024-12-05T12:15:00Z" },
    { id: "NKF-REF-000087", initials: "AT", status: "completed", passType: "party_pass", amount: 120, completedAt: "2024-12-05T10:00:00Z" },
  ],
  currentlyProcessing: [
    { id: "NKF-REF-000090", initials: "RB", status: "processing", passType: "full_pass" },
    { id: "NKF-REF-000091", initials: "LD", status: "processing", passType: "workshop_pass" },
    { id: "NKF-REF-000092", initials: "CP", status: "processing", passType: "vip_pass" },
  ],
  waivedList: [
    { id: "NKF-REF-000050", initials: "AB", status: "completed", passType: "full_pass", amount: 250 },
    { id: "NKF-REF-000055", initials: "CD", status: "completed", passType: "party_pass", amount: 120 },
    { id: "NKF-REF-000060", initials: "EF", status: "completed", passType: "vip_pass", amount: 450 },
  ],
  lastUpdated: new Date().toISOString(),
};

// ==================== MOCK FUNCTIONS ====================

const mockValidateEmail = async (email: string): Promise<EmailValidationResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const normalizedEmail = email.toLowerCase().trim();
  const holder = MOCK_PASS_HOLDERS[normalizedEmail];

  if (!holder) {
    return {
      success: false,
      error: "not_found",
      errorMessage: "We couldn't find a ticket purchase associated with this email address.",
    };
  }

  if ((holder as any).hasChargeback === true) {
    return {
      success: false,
      error: "chargeback",
      errorMessage: "This email is associated with a chargeback. Please contact us on Facebook to resolve this.",
    };
  }

  return {
    success: true,
    passHolder: holder as PassHolder,
  };
};

let mockConfirmationCounter = 100;

const mockSubmitRequest = async (_data: RefundRequestData): Promise<RefundSubmissionResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Simulate occasional errors (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: "Server error. Please try again.",
    };
  }

  mockConfirmationCounter++;
  const confirmationNumber = `NKF-REF-${String(mockConfirmationCounter).padStart(6, "0")}`;

  return {
    success: true,
    confirmationNumber,
  };
};

const mockCheckStatus = async (request: StatusLookupRequest): Promise<StatusLookupResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const statusData = MOCK_STATUS_DATA[request.confirmationNumber.toUpperCase()];

  if (!statusData) {
    return {
      success: false,
      error: "not_found",
    };
  }

  return {
    success: true,
    request: statusData,
  };
};

const mockFetchProgress = async (): Promise<ProgressData> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    ...MOCK_PROGRESS_DATA,
    lastUpdated: new Date().toISOString(),
  };
};

// ==================== REAL API FUNCTIONS ====================

const realValidateEmail = async (email: string): Promise<EmailValidationResponse> => {
  try {
    const response = await fetch(N8N_VALIDATE_EMAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Email validation error:", error);
    return {
      success: false,
      error: "server_error",
      errorMessage: "Unable to connect to the server. Please try again.",
    };
  }
};

const realSubmitRequest = async (data: RefundRequestData): Promise<RefundSubmissionResponse> => {
  try {
    const response = await fetch(N8N_SUBMIT_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Submit request error:", error);
    return {
      success: false,
      error: "Unable to submit your request. Please try again.",
    };
  }
};

const realCheckStatus = async (request: StatusLookupRequest): Promise<StatusLookupResponse> => {
  try {
    const response = await fetch(N8N_CHECK_STATUS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Status check error:", error);
    return {
      success: false,
      error: "server_error",
    };
  }
};

const realFetchProgress = async (): Promise<ProgressData> => {
  try {
    const response = await fetch("/progress.json");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch progress error:", error);
    throw error;
  }
};

// ==================== EXPORTED API FUNCTIONS ====================

export const validateEmail = USE_MOCK ? mockValidateEmail : realValidateEmail;
export const submitRefundRequest = USE_MOCK ? mockSubmitRequest : realSubmitRequest;
export const checkStatus = USE_MOCK ? mockCheckStatus : realCheckStatus;
export const fetchProgress = USE_MOCK ? mockFetchProgress : realFetchProgress;

// ==================== HOOKS ====================

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useEmailValidation() {
  const [state, setState] = useState<ApiState<EmailValidationResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const validate = useCallback(async (email: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await validateEmail(email);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, validate, reset };
}

export function useRefundSubmission() {
  const [state, setState] = useState<ApiState<RefundSubmissionResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const submit = useCallback(async (data: RefundRequestData) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await submitRefundRequest(data);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, submit, reset };
}

export function useStatusLookup() {
  const [state, setState] = useState<ApiState<StatusLookupResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const lookup = useCallback(async (confirmationNumber: string, email: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await checkStatus({ confirmationNumber, email });
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, lookup, reset };
}

export function useProgressData() {
  const [state, setState] = useState<ApiState<ProgressData>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchProgress();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return { ...state, fetch };
}

// Export mock mode status for debugging
export const isMockMode = USE_MOCK;
