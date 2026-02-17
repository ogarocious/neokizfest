import { useState } from "react";
import type { FlowerContentType, FlowerSubmissionResponse } from "../types/flowers";

interface SubmissionState {
  loading: boolean;
  uploading: boolean;
  submitted: boolean;
  error: string | null;
}

interface UseFlowerSubmissionOptions {
  cloudName: string;
  uploadPreset: string;
}

export function useFlowerSubmission({ cloudName, uploadPreset }: UseFlowerSubmissionOptions) {
  const [state, setState] = useState<SubmissionState>({
    loading: false,
    uploading: false,
    submitted: false,
    error: null,
  });

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || "Upload failed");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const submit = async ({
    name,
    email,
    contentType,
    message,
    file,
  }: {
    name: string;
    email: string;
    contentType: FlowerContentType;
    message?: string;
    file?: File | null;
  }) => {
    setState({ loading: true, uploading: false, submitted: false, error: null });

    try {
      let mediaUrl: string | undefined;

      // Upload to Cloudinary if there's a file
      if (file) {
        setState((s) => ({ ...s, uploading: true }));
        mediaUrl = await uploadToCloudinary(file);
        setState((s) => ({ ...s, uploading: false }));
      }

      // Submit to Rails API
      const res = await fetch("/api/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          content_type: contentType,
          message: message || undefined,
          media_url: mediaUrl,
        }),
      });

      const data: FlowerSubmissionResponse = await res.json();

      if (data.success) {
        setState({ loading: false, uploading: false, submitted: true, error: null });
      } else {
        setState({ loading: false, uploading: false, submitted: false, error: data.error || "Submission failed" });
      }
    } catch {
      setState({
        loading: false,
        uploading: false,
        submitted: false,
        error: "Something went wrong. Please try again.",
      });
    }
  };

  const reset = () => {
    setState({ loading: false, uploading: false, submitted: false, error: null });
  };

  return { ...state, submit, reset };
}
