export const REGIONS = ["North", "East", "South", "West", "Central"] as const;
export const CANDIDATE_TYPES = [
  "Nurse",
  "Caregiver",
  "Driver",
  "Cleaner",
  "Coordinator",
] as const;

export type Region = (typeof REGIONS)[number];
export type CandidateType = (typeof CANDIDATE_TYPES)[number];
export type AircallStatus = "Not called" | "In progress" | "Completed" | "No answer";
export type DealOutcome = "open" | "successful" | "rejected";

export interface Owner {
  id: string;
  name: string;
}

export interface Property {
  label: string;
  value: string;
}

export interface Deal {
  id: string;
  name: string;
  stage: string;
  outcome: DealOutcome;
  rejectReason?: string;
  lastActivity: string;
  lastActivityDate: string;
  properties: Property[];
}

export interface PastDeal {
  id: string;
  name: string;
  stage: string;
  outcome: Exclude<DealOutcome, "open">;
  closedDate: string;
  rejectReason?: string;
}

export interface RelatedContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  matchedBy: "phone" | "name";
}

export interface PreviousClient {
  id: string;
  name: string;
  role: string;
  period: string;
}

export interface FormField {
  label: string;
  value: string;
}

export interface FormSubmission {
  title: string;
  submittedAt: string;
  fields: FormField[];
}

export interface CvExperience {
  role: string;
  place: string;
  period: string;
}

export interface CvFile {
  fileName: string;
  uploadedAt: string;
  source: string;
  profile: string;
  experience: CvExperience[];
  education: string;
  languages: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: CandidateType;
  residentialLocation: string;
  region: Region;
  ownerId: string;
  aircallStatus: AircallStatus;
  currentDeal: Deal;
  pastDeals: PastDeal[];
  relatedContacts: RelatedContact[];
  previousClients: PreviousClient[];
  form: FormSubmission;
  cv: CvFile;
}
