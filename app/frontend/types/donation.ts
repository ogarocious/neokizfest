export interface DonationCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
  errorMessage?: string;
}
