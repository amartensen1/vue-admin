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
} as const;


