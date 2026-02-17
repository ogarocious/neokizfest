// Content types for flower submissions
export type FlowerContentType = "text" | "image" | "audio" | "video";

// Source of the flower entry
export type FlowerSource =
  | "submission"
  | "curated"
  | "artist"
  | "community_refund"
  | "community_waive"
  | "community_donation";

// A single flower entry (sanitized for public display)
export interface FlowerEntry {
  id: string;
  displayName: string;
  contentType: FlowerContentType;
  message?: string;
  mediaUrl?: string;
  imageUrl?: string; // Artist photo
  role?: string; // Artist role
  source: FlowerSource;
  dateSubmitted?: string;
}

// Community message from Notion (refund requests / donations)
export interface CommunityMessageEntry {
  id: string;
  display_name: string;
  content_type: string;
  message: string;
  source: string;
  date_submitted?: string;
}

// Raw flower data from Rails (snake_case)
export interface RawFlowerEntry {
  id: string;
  display_name: string;
  content_type: string;
  message?: string;
  media_url?: string;
  source: string;
  date_submitted?: string;
}

// Props passed from Rails via Inertia
export interface FlowersPageProps {
  flowers: RawFlowerEntry[];
  communityMessages: CommunityMessageEntry[];
  lastUpdated: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
}

// Submission form data sent to the API
export interface FlowerSubmissionData {
  name: string;
  email: string;
  content_type: FlowerContentType;
  message?: string;
  media_url?: string;
}

// API response
export interface FlowerSubmissionResponse {
  success: boolean;
  error?: string;
}

// Filter options for the gallery
export type FlowerFilter = "all" | "text" | "image" | "audio" | "video" | "artist" | "community";
