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

export interface CreateBusinessListDto {
  title: string;
  category: string;
  location: string;
  keyword: string;
  description?: string;
}

export interface UpdateBusinessListDto {
  title?: string;
  category?: string;
  location?: string;
  keyword?: string;
  description?: string;
}

export interface BulkCreateBusinessListDto {
  lists: CreateBusinessListDto[];
}

export interface BusinessList {
  id: string;
  title: string;
  category: string;
  location: string;
  keyword: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { businesses: number };
}

export interface BusinessListDetail extends BusinessList {
  businesses: Business[];
}

// ---------- Businesses ----------
export interface CreateBusinessDto {
  businessListId: string;
  placeId?: string;
  businessName: string;
  category?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  fullAddress?: string;
  city?: string;
  googleMapsUrl?: string;
  rating?: number;
  reviewCount?: number;
  contactPerson?: string;
  leadStatus?: string;
  notes?: string;
}

export interface UpdateBusinessDto {
  businessName?: string;
  category?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  fullAddress?: string;
  city?: string;
  googleMapsUrl?: string;
  rating?: number;
  reviewCount?: number;
  contactPerson?: string;
  leadStatus?: string;
  notes?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  emailStatus?: string;
  lastEmailSentAt?: string;
  whatsappStatus?: string;
  lastWhatsAppSentAt?: string;
  whatsappOptIn?: boolean;
}

export interface BulkImportBusinessDto {
  businessListId: string;
  businesses: Array<Omit<CreateBusinessDto, "businessListId">>;
}

export interface Business {
  id: string;
  businessListId: string;
  placeId?: string | null;
  businessName: string;
  category?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  fullAddress?: string | null;
  city?: string | null;
  googleMapsUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  contactPerson?: string | null;
  leadStatus: string;
  notes?: string | null;
  lastContactedAt?: string | null;
  nextFollowUpAt?: string | null;
  emailStatus: string;
  lastEmailSentAt?: string | null;
  emailCount: number;
  whatsappStatus: string;
  lastWhatsAppSentAt?: string | null;
  whatsappCount: number;
  whatsappOptIn: boolean;
  whatsappOptInAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  businessList?: { id: string; title: string };
}
