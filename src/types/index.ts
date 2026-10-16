export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type ProfileVisibility = 'public' | 'partially_restricted' | 'private';
export type PasswordHabit = 'never' | 'some_secondary_sites' | 'frequently';
export type MfaHabit = 'all_accounts' | 'some_accounts' | 'none';
export type AuditHabit = 'regularly' | 'rarely' | 'never';
export type UnknownRequestsHabit = 'never' | 'sometimes' | 'frequently';
export type ClicksLinksHabit = 'never' | 'rarely' | 'sometimes';

export interface ProfileAssessmentInput {
  profileName: string;
  // A. Public Profile Information
  profileVisibility: ProfileVisibility;
  revealsInstitution: boolean;
  institutionName?: string;
  revealsContactInfo: boolean;
  contactDetailsVisible: string[]; // e.g. ["Email", "Phone", "Social Handle"]
  revealsLocationRoutine: boolean;
  revealsBirthdateMilestones: boolean;

  // B. Online Sharing Habits
  postsTravelRealtime: boolean;
  sharesUnredactedScreenshots: boolean;
  sharesCertsOrIDs: boolean;
  postsFamilyColleagues: boolean;
  reusesUsernames: boolean;
  sharesProjectDetails: boolean;

  // C. Account Security Habits
  reusesPasswords: PasswordHabit;
  mfaEnabled: MfaHabit;
  reviewsPrivacySettings: AuditHabit;
  acceptsUnknownRequests: UnknownRequestsHabit;
  clicksUnexpectedLinks: ClicksLinksHabit;
  sharesWithUnverifiedContacts: boolean;

  // D. Optional Text Analysis
  sanitizedPostText?: string;
}

export type CategoryKey = 
  | 'identity'
  | 'academic_professional'
  | 'location_routine'
  | 'contact_details'
  | 'account_security'
  | 'oversharing_habits';

export interface CategoryScoreDetail {
  category: CategoryKey;
  label: string;
  score: number; // 0 to 100
  maxScore: number;
  weight: number;
  level: RiskLevel;
  description: string;
  findingsCount: number;
}

export interface ScoredFactor {
  id: string;
  category: CategoryKey;
  label: string;
  riskPoints: number;
  status: 'safe' | 'warning' | 'danger';
  explanation: string;
  remedy: string;
}

export interface ExposureFinding {
  category: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  explanation: string;
  recommendation: string;
}

export interface SocialEngineeringRisk {
  attackType: string;
  explanation: string;
  defensiveAction: string;
}

export interface AiPrivacyAnalysis {
  available: boolean;
  engineUsed: 'gemini-3.8-flash' | 'deterministic-fallback';
  summary: string;
  exposureFindings: ExposureFinding[];
  socialEngineeringRisks: SocialEngineeringRisk[];
  priorityActions: string[];
  limitations: string[];
}

export interface ActionPlanItem {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: CategoryKey;
  action: string;
  impact: string;
  completed: boolean;
}

export interface AssessmentRecord {
  id: string;
  timestamp: string;
  profileName: string;
  isSample: boolean;
  sampleType?: 'student' | 'professional' | 'privacy_conscious';
  inputs: ProfileAssessmentInput;
  overallScore: number;
  riskLevel: RiskLevel;
  totalIndicators: number;
  categoryScores: Record<CategoryKey, CategoryScoreDetail>;
  scoredFactors: ScoredFactor[];
  highPriorityRisks: Array<{
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    detail: string;
  }>;
  aiAnalysis: AiPrivacyAnalysis;
  actionPlan: ActionPlanItem[];
}

export interface SimulatorScenario {
  id: string;
  title: string;
  targetRole: string;
  publicDataInvolved: string[];
  psychologicalTactic: string;
  tacticExplanation: string;
  believabilityFactor: string;
  simulatedMessage: {
    sender: string;
    channel: 'LinkedIn' | 'Email' | 'SMS' | 'Direct Message';
    subject?: string;
    body: string;
    redFlags: Array<{
      phrase: string;
      reason: string;
    }>;
  };
  warningSigns: string[];
  defensiveVerification: string[];
}
