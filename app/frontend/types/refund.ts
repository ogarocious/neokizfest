// Pass types available at the festival
export type PassType =
  | "full_pass"
  | "party_pass"
  | "workshop_pass"
  | "vip_pass"
  | "artist_pass";

// Refund decision options
export type RefundDecision = "full" | "partial" | "waive";

// Payment method for refund
export type RefundPaymentMethod = "zelle" | "wise";

// Zelle contact info
export interface ZelleInfo {
  email?: string;
  phone?: string;
}

// Wise contact info
export interface WiseInfo {
  email: string;
}

// Combined payment info
export interface PaymentInfo {
  method: RefundPaymentMethod;
  zelle?: ZelleInfo;
  wise?: WiseInfo;
}

// Pass holder record from Notion
export interface PassHolder {
  email: string;
  name: string;
  passType: PassType;
  amountPaid: number;
  purchaseDate: string;
  confirmationNumber?: string;
  hasChargeback: boolean;
  notionPageId?: string;
}

// Email validation response
export interface EmailValidationResponse {
  success: boolean;
  error?: "not_found" | "chargeback" | "already_submitted" | "server_error";
  errorMessage?: string;
  passHolder?: PassHolder;
  existingConfirmation?: string;
  existingStatus?: string;
}

// Refund request submission data
export interface RefundRequestData {
  email: string;
  name: string;
  passType: PassType;
  amountPaid: number;
  decision: RefundDecision;
  refundAmount: number;
  paymentMethod: RefundPaymentMethod;
  zelleInfo?: ZelleInfo;
  wiseInfo?: WiseInfo;
  ticketHolderPageId?: string;
}

// Refund request submission response
export interface RefundSubmissionResponse {
  success: boolean;
  confirmationNumber?: string;
  emailSent?: boolean;
  error?: string;
}

// Status lookup request
export interface StatusLookupRequest {
  email: string;
  confirmationNumber: string;
}

// Request status types
// Backend currently returns: pending, processing, completed
// on_hold and cancelled are defensive — kept for StatusBadge completeness
export type RequestStatus =
  | "pending"
  | "processing"
  | "completed"
  | "on_hold"
  | "cancelled";

// Status lookup response
export interface StatusLookupResponse {
  success: boolean;
  error?: "not_found" | "server_error";
  request?: {
    confirmationNumber: string;
    status: RequestStatus;
    decision: RefundDecision;
    amountPaid?: number;
    refundAmount?: number;
    submittedAt: string;
    completedAt?: string;
    notes?: string;
  };
}

// Progress dashboard data
export interface ProgressData {
  stats: {
    totalRequests: number;
    completedRefunds: number;
    processingRefunds: number;
    waivedRefunds: number;
    totalRefundAmount: number;
    totalWaivedAmount: number;
  };
  recentCompletions: ProgressEntry[];
  currentlyProcessing: ProgressEntry[];
  waivedList: ProgressEntry[];
  lastUpdated: string;
}

export interface ProgressEntry {
  id: string;
  initials: string;
  status: RequestStatus;
  passType: PassType;
  amount?: number;
  completedAt?: string;
}

// Form step tracking
export type RefundFormStep =
  | "email"
  | "passDetails"
  | "decision"
  | "contact"
  | "review";

// Form state for multi-step form
export interface RefundFormState {
  currentStep: RefundFormStep;
  completedSteps: RefundFormStep[];

  // Step 1: Email lookup
  email: string;
  passHolder: PassHolder | null;

  // Step 2 & 3: Decision
  decision: RefundDecision | null;
  partialAmount: number | null;

  // Step 4: Contact - only if requesting refund
  paymentMethod: RefundPaymentMethod | null;
  zelleInfo: ZelleInfo | null;
  wiseInfo: WiseInfo | null;

  // Computed
  calculatedRefund: number;
  finalRefund: number;
}

// Mock data for development
export interface MockPassHolderData {
  [email: string]: PassHolder | { hasChargeback: true };
}
