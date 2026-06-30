export interface ComplaintData {
  customerId: string;
  distributorName: string;
  consumerName: string;
  consumerNumber: string;
  mobileNumber: string;
  srNumber: string;
  dateOpened: string;
  assignedTo: string;
  category: string;
  subCategory: string;
  priority: string;
  srStatus: string;
  complaintDescription: string;
}

export interface GenerationResult {
  customerResponse: string;
  customerResponseHindi?: string;
  customerSummary?: string;
  sentiment?: "Positive" | "Neutral" | "Frustrated" | "Critical";
  sentimentConfidence?: string;
  severity?: "Low" | "Medium" | "High" | "Critical";
  primaryCause?: string;
  secondaryCause?: string;
  causeConfidence?: string;
  recommendedActions?: string[];
  probableCause: string;
  suggestedAction: string;
  escalationRequired: string;
  priority: string;
  srStatus: string;
  confidenceLevel: "High" | "Medium" | "Low";
  confidenceReason: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  srNumber: string;
  consumerName: string;
  category: string;
  customerResponse: string;
  probableCause: string;
  suggestedAction: string;
  escalationRequired: string;
  confidenceLevel: string;
  priority: string;
  srStatus: string;
}

export interface MasterConfig {
  categories: { [category: string]: string[] };
  priorities: string[];
  statuses: string[];
}
