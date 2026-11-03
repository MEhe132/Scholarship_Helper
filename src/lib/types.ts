export type DegreeLevel = 'BSc' | 'MSc' | 'PhD' | 'Direct PhD';

export type FundingType = 
  | '100% Fully Funded'
  | 'Tuition Free (Public)'
  | 'Need-Based Grant (DSU)'
  | 'Research Assistantship (GRA/GTA)'
  | 'Government Award'
  | 'Partial Waiver';

export interface DuplicateNotice {
  id: string;
  sourceTitle: string;
  sourceAuthority: string;
  sourceUrl: string;
  note: string;
  discoveredAt: string;
}

export interface LatestNewsItem {
  id: string;
  title: string;
  authorityName: string;
  authorityShortCode: string;
  country: string;
  countryFlag: string;
  category: 'Breaking Deadline' | 'New Circular' | 'Portal Opened' | 'Funding Increase' | 'Guide Update';
  summary: string;
  publishedAt: string; // ISO string or relative label
  officialLink: string;
  isUrgent?: boolean;
}

export interface Authority {
  id: string;
  name: string;
  shortCode: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  logoUrl?: string;
  officialWebsite: string;
  tuitionType: string;
  workRightsText: string;
  availableNewsCount: number;
  lastSyncedAt: string;
  badge: string;
  summary: string;
  minCgpaRecommendation: number;
  greRequired: boolean;
  ieltsRecommended: number;
  popularFields: string[];
  duplicateNotices?: DuplicateNotice[];
}

export interface ScholarshipProgram {
  id: string;
  authorityId: string;
  title: string;
  institution: string;
  country: string;
  countryFlag: string;
  degreeLevel: DegreeLevel[];
  fundingType: FundingType;
  stipendAmount?: string;
  tuitionFee: string;
  minCgpa: number;
  greRequired: boolean;
  ieltsMin: number;
  deadline: string;
  officialLink: string;
  isVerified: boolean;
  description: string;
  duplicateSources?: DuplicateNotice[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  currentDegree: string;
  currentMajor: string;
  cgpa: number;
  cgpaScale: number;
  ieltsScore?: number;
  greQuant?: number;
  greVerbal?: number;
  targetDegree: DegreeLevel[];
  preferredCountries: string[];
  fundingPreference: 'fully_funded' | 'tuition_free_work' | 'both';
  expectedGraduationYear: number;
  targetIntake: string;
}

export type ApplicationStatus = 
  | 'shortlisted'
  | 'preparing'
  | 'applied'
  | 'under_review'
  | 'interview'
  | 'accepted'
  | 'rejected';

export interface ApplicationCard {
  id: string;
  authorityShortCode?: string;
  scholarshipTitle: string;
  universityName: string;
  country: string;
  countryFlag: string;
  status: ApplicationStatus;
  deadline?: string;
  notes?: string;
  updatedAt: string;
}

export type DocumentCategory = 'cv' | 'sop' | 'transcript' | 'lor' | 'certificate' | 'other';

export interface DocumentItem {
  id: string;
  fileName: string;
  fileCategory: DocumentCategory;
  fileSizeKb: number;
  fileUrl: string;
  uploadedAt: string;
  notes?: string;
}
