import axiosInstance from "../../../lib/axios";
import type {
  Application,
  ApplicationsResponse,
  ApplicationResponse,
  DeleteApplicationResponse,
  CreateApplicationFormData,
} from "../types/application.types";

export const applicationsApi = {
  // Public - Submit application with file upload
  createApplication: async (
    data: CreateApplicationFormData,
  ): Promise<ApplicationResponse> => {
    const formData = new FormData();

    // All text data goes into "data" field as JSON string
    const jsonData = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      position: data.position,
      yearsOfExperience: data.yearsOfExperience,
      ...(data.portfolioUrl && { portfolioUrl: data.portfolioUrl }),
      ...(data.linkedInProfile && { linkedInProfile: data.linkedInProfile }),
      ...(data.githubProfile && { githubProfile: data.githubProfile }),
      ...(data.coverLetter && { coverLetter: data.coverLetter }),
    };

    formData.append("data", JSON.stringify(jsonData));
    formData.append("resume", data.resume);

    const response = await axiosInstance.post<ApplicationResponse>(
      "/application",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        skipToast: true, // Let the hook handle toast
      },
    );
    return response.data;
  },

  // Admin - Get all applications
  getAllApplications: async (): Promise<Application[]> => {
    const response =
      await axiosInstance.get<ApplicationsResponse>("/application");
    return response.data.data;
  },

  // Admin - Get single application
  getApplicationById: async (id: string): Promise<Application> => {
    const response = await axiosInstance.get<ApplicationResponse>(
      `/application/${id}`,
    );
    return response.data.data;
  },

  // Admin - Delete application
  deleteApplication: async (id: string): Promise<DeleteApplicationResponse> => {
    const response = await axiosInstance.delete<DeleteApplicationResponse>(
      `/application/${id}`,
    );
    return response.data;
  },
};
