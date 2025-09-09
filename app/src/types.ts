export type UserRole = "Counselor" | "CollegeStaff";

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  signedInAt: string; // ISO timestamp
}

export type ApplicationStatus = "Draft" | "Submitted";

export interface StudentProfile {
  firstName: string;
  lastName: string;
  dob?: string;
  email?: string;
  phone?: string;
}

export interface GuardianContact {
  name?: string;
  email?: string;
  phone?: string;
}

export interface StudentApplicationRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // user id
  status: ApplicationStatus;
  profile: StudentProfile;
  school: { name?: string };
  guardians?: GuardianContact[];
  notes?: string;
  // Extended application schema (frontend-only prototype)
  dbId?: number; // maps to integer id
  owner_id?: number;
  owner_type?: string; // default "College"
  student_id?: number;
  term_id?: number;
  gender?: string;
  citizenship_country?: string;
  birth_country?: string;
  residency_state?: string;
  hs_current_grade?: string;
  county?: string;
  visa_type?: string;
  us_citizen?: string;
  default_consent_method?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  ssn?: string;
  hs_stud_id?: string;
  hs_start_date?: string; // ISO date
  hs_grad_date?: string; // ISO date
  hs_gpa?: number; // precision 4,2
  class_rank?: string;
  residency?: string;
  hispanic?: boolean;
  american_indian?: boolean;
  asian?: boolean;
  black?: boolean;
  pacific_islander?: boolean;
  white?: boolean;
  mena?: boolean;
  ethnicity?: string;
  primary_language?: string;
  have_special_needs?: boolean;
  student_number?: string;
  guidance_counselor_user_id?: number;
  guidance_counselor_user_name?: string;
  student_completed?: string; // serialized array (string)
  student_completed_array?: string[];
  approver_name?: string;
  approver_email?: string;
  hs_gpa_updated_at?: string; // datetime ISO
  application_field_values_updated_at?: string; // datetime ISO
  completed_at?: string; // datetime ISO
  update_required_at?: string; // datetime ISO
  intermediate_id?: string;
}

export type DocumentKind = "Transcript" | "Other";

export interface DocumentMetadata {
  id: string;
  applicationId: string;
  kind: DocumentKind;
  name: string;
  mimeType: string;
  size: number;
  storedRef: string; // key into blob store or base64
  uploadedAt: string;
  uploadedBy: string; // user id
}

export type AuditAction =
  | "SIGN_IN"
  | "SIGN_OUT"
  | "APP_CREATE"
  | "APP_EDIT"
  | "APP_SUBMIT"
  | "DOC_ADD"
  | "DOC_REMOVE";

export interface AuditRecord {
  id: string;
  ts: string;
  actorId: string;
  actorRole: UserRole;
  action: AuditAction;
  meta?: Record<string, unknown>;
}

export interface ResultOk<T> {
  ok: true;
  value: T;
}

export interface ResultErr {
  ok: false;
  error: string;
}

export type Result<T> = ResultOk<T> | ResultErr;

export const LOCAL_KEYS = {
  currentUser: "de.currentUser",
  students: "de.students",
  docs: "de.docs",
  audit: "de.auditLog",
  registrations: "de.registrations",
  consents: "de.consents",
  consentTokens: "de.consentTokens",
  reminders: "de.reminders",
  programs: "de.programs",
  terms: "de.terms",
  courses: "de.courses",
  sections: "de.sections",
  highSchools: "de.highSchools",
  settings: "de.settings",
} as const;

// Phase 2 types
export type RegistrationStatus = "Draft" | "WaitingParent" | "WaitingCounselor" | "Complete" | "Abandoned";

export interface RegistrationTimelineItem {
  id: string;
  step: "Student" | "Parent" | "Counselor";
  ownerRole: "Student" | "Parent" | "Counselor";
  state: "NotStarted" | "Waiting" | "Complete" | "Abandoned";
  updatedAt: string;
  note?: string;
}

export interface RegistrationHistoryItem {
  id: string;
  ts: string;
  actorRole: string;
  action: string;
  meta?: any;
}

export interface RegistrationNotificationItem {
  id: string;
  ts: string;
  channel: "email" | "sms";
  to: string;
  subject?: string;
  bodyPreview?: string;
}

export interface RegistrationRecord {
  id: string;
  studentId: string;
  sectionId: string;
  status: RegistrationStatus;
  timeline: RegistrationTimelineItem[];
  history: RegistrationHistoryItem[];
  notifications: RegistrationNotificationItem[];
}

export interface ConsentRecord {
  id: string;
  registrationId: string;
  signerName: string;
  relationship: string;
  signatureHash: string;
  ts: string;
  ip?: string;
  userAgent?: string;
}

export interface ConsentTokenRecord {
  token: string;
  registrationId: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface ReminderRecord {
  id: string;
  ts: string;
  criteria: { step?: string; hsId?: string; termId?: string };
  amplification?: { email?: string; sms?: string };
  recipients: string[]; // registration ids
}

// Admin-Lite entities
export interface ProgramRecord {
  id: string; // client id
  dbId?: number; // maps to integer primary key
  name: string;
  internal_name?: string;
  owner_type?: string;
  owner_id?: number; // bigint in backend; number here
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
}
export interface TermRecord {
  id: string; // client id
  dbId?: number; // maps to integer PK
  // Existing Admin-Lite fields
  name: string;
  isActive: boolean;
  customDates?: Record<string, string>;
  // Backend schema fields
  college_id?: number;
  session_description?: string;
  session_code?: string;
  start_date?: string; // ISO date
  end_date?: string;   // ISO date
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
  inactive?: boolean; // default false
  high_school_term?: boolean;
  associated_college_term_id?: number;
  hide_from_list?: boolean;
  show_in_ca_active_flow_steps?: boolean;
  hide_from_course_finder?: boolean; // default false
}
export interface CourseRecord {
  id: string; // client id
  dbId?: number; // integer PK (backend)
  programId?: string; // admin-lite linkage
  title: string;
  code?: string; // UI convenience
  // Backend schema fields
  college_id?: number; // not null in backend
  subject?: string;
  number?: string;
  description?: string;
  credits?: number; // 4,2
  expansion?: boolean;
  audit?: boolean;
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
  archive?: boolean;
  alt_number?: number;
  requisites?: string;
  ignore_for_ca?: boolean;
}
export interface SectionRecord {
  id: string; // client id
  dbId?: number; // backend PK
  // Admin-Lite linkage
  courseId: string; // client course id
  termId: string;   // client term id
  allowRegistration: boolean;
  meetingInfo?: string;
  capacity?: number;
  // Backend schema fields
  course_id?: number; // not null
  term_id?: number;
  number?: string; // not null
  alt_number?: string;
  title?: string;
  description?: string;
  instructor_type?: string;
  instructor_id?: number;
  building?: string;
  room?: string;
  location?: string;
  delivery_format?: string;
  start_time?: string; // HH:MM:SS
  end_time?: string;   // HH:MM:SS
  meeting_day_mon?: boolean;
  meeting_day_tue?: boolean;
  meeting_day_wed?: boolean;
  meeting_day_thu?: boolean;
  meeting_day_fri?: boolean;
  meeting_day_sat?: boolean;
  meeting_day_sun?: boolean;
  start_date?: string; // ISO date
  end_date?: string;   // ISO date
  allow_registration?: boolean; // default true
  allow_high_schools?: string;
  campus_id?: number;
  check_capacity?: boolean;
  taught_at_high_school_id?: number;
  course_section_group?: string;
  wish_list?: boolean;
  override_instructor_approval?: boolean;
  exclude_from_surveys?: boolean;
  launch_course_section_group_as_registrations?: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface HighSchoolRecord {
  id: string; // client id
  dbId?: number; // backend PK
  name: string; // convenience display; maps to schl_name
  // Backend schema fields
  nces_id?: string;
  nces_schl_id?: string;
  state_id?: string;
  state_schl_id?: string;
  act_code?: string;
  ceeb_code?: string;
  schl_name?: string;
  county?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string; // 2-char
  zip?: string; // up to 10
  phone?: string; // up to 25
  school_type?: string;
  charter?: boolean;
  magnet?: boolean;
  title1?: boolean;
  title1_sw?: boolean;
  enrollment?: number;
  native_american?: number;
  asian?: number;
  black?: number;
  hispanic?: number;
  white?: number;
  mixed?: number;
  offers_de?: boolean;
  offers_ap?: boolean;
  offers_ib?: boolean;
  pct_college?: number; // decimal(10)
  url?: string;
  free_lunch?: number;
  reduced_lunch?: number;
  religion?: string;
  latitude?: number; // decimal(15,10)
  longitude?: number; // decimal(15,10)
  activation_date?: string; // datetime
  created_at?: string;
  updated_at?: string;
  principal?: string;
  archive?: boolean;
  placeholder?: boolean;
  district_id?: number;
  area_center?: boolean;
  home_school?: boolean;
}
export interface SettingsRecord { registrationOpen: boolean; noRegistrationMessage?: string }


