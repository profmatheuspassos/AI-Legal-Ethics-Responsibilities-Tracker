export type Language = 'pt' | 'en';

export type IssuerCategory =
  | 'bar_association'
  | 'court_judiciary'
  | 'legislature'
  | 'government_agency'
  | 'international_body'
  | 'research_institute';

export type ResourceStatus =
  | 'active_guidance'
  | 'court_rule_order'
  | 'enacted_law'
  | 'pending_bill'
  | 'died_bill';

export type RiskCode =
  | 'hallucinations'
  | 'confidentiality_leakage'
  | 'bias_perpetuation'
  | 'absence_transparency_trust'
  | 'diminished_human_judgment'
  | 'problematic_billing'
  | 'ip_infringement'
  | 'rapid_tech_change'
  | 'cybersecurity_risks'
  | 'ai_fabricated_evidence'
  | 'lack_data_oversight'
  | 'inaccurate_misleading_info'
  | 'ambiguous_regulatory_landscape'
  | 'manipulation'
  | 'environmental_degradation';

export interface LocalizedText {
  en: string;
  pt: string;
}

export interface RiskItem {
  code: RiskCode;
  label: LocalizedText;
}

export interface TrackerEntry {
  id: string;
  sourcePage: number;
  jurisdiction: {
    countryCode: string;
    country: LocalizedText;
    subdivision: LocalizedText | null;
    region: LocalizedText;
  };
  issuer: {
    name: LocalizedText;
    category: IssuerCategory;
  };
  resource: {
    title: LocalizedText;
    dateDisplay: LocalizedText;
    year: number | null;
    status: ResourceStatus;
    isMachineTranslated: boolean;
  };
  risks: RiskItem[];
  recommendations: {
    en: string[];
    pt: string[];
  };
}

export type AuditAction = 'created' | 'updated' | 'imported' | 'reset';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  entryId: string;
  jurisdiction: LocalizedText;
  entryTitle: LocalizedText;
  summary: LocalizedText;
}

export interface TrackerBackupPayload {
  metadata: {
    exportedAt: string;
    baseEdition: string;
    totalEntries: number;
  };
  entries: TrackerEntry[];
  auditLog: AuditLogEntry[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GeminiLegislativeCheckResult {
  summaryPt: string;
  summaryEn: string;
  suggestedStatus: ResourceStatus | null;
  suggestedDatePt: string;
  suggestedDateEn: string;
  suggestedYear: number | null;
  suggestedNotePt: string;
  suggestedNoteEn: string;
  sources: GroundingSource[];
}

export type ActiveTab = 'explorer' | 'analytics' | 'monitor';

export type QuickScope = 'all' | 'non_us' | 'us' | 'europe' | 'legislation';

export type SortOption = 'country_asc' | 'year_desc' | 'year_asc' | 'source_page_asc';

export type RiskFilterValue = 'all' | 'na_no_risks' | RiskCode;

export type YearFilterValue = 'all' | 'not_specified' | string;

export interface ExplorerFilterState {
  search: string;
  scope: QuickScope;
  region: string;
  countryCode: string;
  subdivision: string;
  issuerCategory: 'all' | IssuerCategory;
  status: 'all' | ResourceStatus;
  risk: RiskFilterValue;
  year: YearFilterValue;
  sort: SortOption;
}
