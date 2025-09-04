import { Repository, IdUtil } from "./repo/storage";
import type { StudentApplicationRecord } from "./types";

export function seedDemoData(): void {
  const existing = Repository.listApplications();
  if (existing.length > 0) return;

  const now = new Date();
  function isoDaysAgo(days: number): string {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  const seedUser = { id: "seed-user", role: "Counselor" as const };

  const samples: StudentApplicationRecord[] = [
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(14),
      updatedAt: isoDaysAgo(12),
      createdBy: seedUser.id,
      status: "Draft",
      profile: { firstName: "Ava", lastName: "Thompson", dob: "2007-03-12", email: "ava.thompson@example.edu", phone: "555-210-4432" },
      school: { name: "Riverview High" },
      guardians: [{ name: "Jamie Thompson", email: "jamie.thompson@example.com" }],
      notes: "Needs transcript upload.",
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(10),
      updatedAt: isoDaysAgo(9),
      createdBy: seedUser.id,
      status: "Draft",
      profile: { firstName: "Noah", lastName: "Garcia", dob: "2006-11-02", email: "noah.garcia@example.edu" },
      school: { name: "Eastview High" },
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(8),
      updatedAt: isoDaysAgo(6),
      createdBy: seedUser.id,
      status: "Submitted",
      profile: { firstName: "Mia", lastName: "Patel", dob: "2007-07-21", email: "mia.patel@example.edu", phone: "555-011-2200" },
      school: { name: "Westfield High" },
      notes: "Parent approval in next phase.",
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(5),
      updatedAt: isoDaysAgo(3),
      createdBy: seedUser.id,
      status: "Submitted",
      profile: { firstName: "Liam", lastName: "Nguyen", dob: "2006-05-30", email: "liam.nguyen@example.edu" },
      school: { name: "Central High" },
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(4),
      updatedAt: isoDaysAgo(2),
      createdBy: seedUser.id,
      status: "Draft",
      profile: { firstName: "Sophia", lastName: "Martinez", dob: "2007-12-10", email: "sophia.martinez@example.edu" },
      school: { name: "North Ridge High" },
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(2),
      updatedAt: isoDaysAgo(1),
      createdBy: seedUser.id,
      status: "Submitted",
      profile: { firstName: "Ethan", lastName: "Kim", dob: "2006-09-18", email: "ethan.kim@example.edu" },
      school: { name: "Riverview High" },
    },
  ];

  Repository.saveApplications(samples);

  // Minimal audit entries for realism
  for (const rec of samples) {
    Repository.appendAudit({ id: IdUtil.uid("audit"), ts: rec.createdAt, actorId: seedUser.id, actorRole: seedUser.role, action: "APP_CREATE", meta: { id: rec.id } });
    if (rec.status === "Submitted") {
      Repository.appendAudit({ id: IdUtil.uid("audit"), ts: rec.updatedAt, actorId: seedUser.id, actorRole: seedUser.role, action: "APP_SUBMIT", meta: { id: rec.id } });
    }
  }
}


