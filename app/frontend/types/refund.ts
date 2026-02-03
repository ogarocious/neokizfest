// Pass types available at the festival
export type PassType =
  | "full_pass"
  | "party_pass"
  | "workshop_pass"
  | "vip_pass"
  | "artist_pass";

// Refund decision options
export type RefundDecision = "full" | "partial" | "waive";

// Shirt sizes available
export type ShirtSize = "S" | "M" | "L" | "XL" | "2XL";

// US States for shipping
export type USState =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY"
  | "DC";

// Shirt order item
export interface ShirtOrder {
  size: ShirtSize;
  quantity: number;
}

// Shipping address
export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: USState;
  zip: string;
}

// Zelle contact info
export interface ZelleInfo {
  email: string;
  phone: string;
}

// Pass holder record from Notion (via n8n)
export interface PassHolder {
  email: string;
  name: string;
  passType: PassType;
  amountPaid: number;
  purchaseDate: string;
  confirmationNumber?: string;
  hasChargeback: boolean;
}

// Email validation response from n8n
export interface EmailValidationResponse {
  success: boolean;
  error?: "not_found" | "chargeback" | "server_error";
  errorMessage?: string;
  passHolder?: PassHolder;
}

// Refund request submission data
export interface RefundRequestData {
  email: string;
  passType: PassType;
  amountPaid: number;
  decision: RefundDecision;
  refundAmount: number;
  wantsShirt: boolean;
  shirts: ShirtOrder[];
  zelleInfo?: ZelleInfo;
  shippingAddress?: ShippingAddress;
  finalRefundAmount: number;
}

// Refund request submission response from n8n
export interface RefundSubmissionResponse {
  success: boolean;
  confirmationNumber?: string;
  error?: string;
}

// Status lookup request
export interface StatusLookupRequest {
  confirmationNumber: string;
  email: string;
}

// Request status types
export type RequestStatus =
  | "pending"
  | "processing"
  | "completed"
  | "on_hold"
  | "cancelled";

// Status lookup response from n8n
export interface StatusLookupResponse {
  success: boolean;
  error?: "not_found" | "server_error";
  request?: {
    confirmationNumber: string;
    status: RequestStatus;
    decision: RefundDecision;
    refundAmount: number;
    shirtOrdered: boolean;
    shirtDetails?: ShirtOrder[];
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
  | "shirt"
  | "contact"
  | "shipping"
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

  // Step 4: Shirt
  wantsShirt: boolean;
  shirts: ShirtOrder[];

  // Step 5: Contact (Zelle)
  zelleInfo: ZelleInfo | null;

  // Step 6: Shipping
  shippingAddress: ShippingAddress | null;

  // Computed
  calculatedRefund: number;
  shirtTotal: number;
  finalRefund: number;
}

// Mock data for development
export interface MockPassHolderData {
  [email: string]: PassHolder | { hasChargeback: true };
}
