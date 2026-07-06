// ──── Domain Types ────────────────────────────────

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  yearsOfExperience: string;
  portfolioUrl?: string | null;
  linkedInProfile?: string | null;
  githubProfile?: string | null;
  coverLetter?: string | null;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ──── Request Types ────────────────────────────────

export interface CreateApplicationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  yearsOfExperience: string;
  portfolioUrl?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  coverLetter?: string;
  resume: File; // The actual file to upload
}

export interface CreateApplicationDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  yearsOfExperience: string;
  portfolioUrl?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  coverLetter?: string;
  resumeUrl: string; // URL from Cloudinary after upload
}

// ──── API Response Types ────────────────────────────

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: Application;
}

export interface DeleteApplicationResponse {
  success: boolean;
  message: string;
  data: null;
}
