export interface CreateLeadDto {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  details?: string;
}

export interface UpdateLeadDto {
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  details?: string;
  status?: string;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  details?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  resumeUrl: string;
  coverLetter?: string;
}

export interface UpdateApplicationDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  yearsOfExperience?: string;
  portfolioUrl?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status?: string;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  yearsOfExperience: string;
  portfolioUrl?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  resumeUrl: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriberDto {
  email: string;
}

export interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}