import { Repository, IdUtil, RegistrationsRepo, ConsentTokensRepo, ProgramsRepo, TermsRepo, CoursesRepo, SectionsRepo, HighSchoolsRepo } from "./repo/storage";
import type { StudentApplicationRecord, RegistrationRecord } from "./types";

export function seedDemoData(): void {
  const existing = Repository.listApplications();

  const now = new Date();
  function isoDaysAgo(days: number): string {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  const seedUser = { id: "seed-user", role: "Counselor" as const };

  // Seed Programs if empty
  if (ProgramsRepo.list().length === 0) {
    const nowIso = new Date().toISOString();
    ProgramsRepo.saveAll([
      { id: IdUtil.uid("prog"), dbId: 1, name: "General Studies", internal_name: "general_studies", owner_type: "College", owner_id: 100, created_at: nowIso, updated_at: nowIso },
      { id: IdUtil.uid("prog"), dbId: 2, name: "Computer Science", internal_name: "cs", owner_type: "College", owner_id: 100, created_at: nowIso, updated_at: nowIso },
      { id: IdUtil.uid("prog"), dbId: 3, name: "Business", internal_name: "business", owner_type: "College", owner_id: 100, created_at: nowIso, updated_at: nowIso },
    ]);
  }

  // Seed Terms if empty
  if (TermsRepo.list().length === 0) {
    const nowIso = new Date().toISOString();
    TermsRepo.saveAll([
      {
        id: IdUtil.uid("term"),
        dbId: 101,
        name: "Spring 2026",
        isActive: true,
        customDates: { registrationStart: "2026-01-10", registrationEnd: "2026-02-15", dropDate: "2026-03-10", withdrawDate: "2026-04-20" },
        college_id: 100,
        session_description: "Spring 2026 Main Session",
        session_code: "SP26",
        start_date: "2026-01-20",
        end_date: "2026-05-15",
        created_at: nowIso,
        updated_at: nowIso,
        inactive: false,
        high_school_term: true,
        associated_college_term_id: 501,
        hide_from_list: false,
        show_in_ca_active_flow_steps: false,
        hide_from_course_finder: false,
      },
      {
        id: IdUtil.uid("term"),
        dbId: 102,
        name: "Fall 2025",
        isActive: false,
        customDates: { registrationStart: "2025-08-01", registrationEnd: "2025-09-05" },
        college_id: 100,
        session_description: "Fall 2025",
        session_code: "FA25",
        start_date: "2025-08-26",
        end_date: "2025-12-10",
        created_at: nowIso,
        updated_at: nowIso,
        inactive: true,
        high_school_term: true,
        associated_college_term_id: 502,
        hide_from_list: false,
        show_in_ca_active_flow_steps: false,
        hide_from_course_finder: false,
      },
    ]);
  }

  // Seed Courses if empty
  if (CoursesRepo.list().length === 0) {
    const nowIso = new Date().toISOString();
    const progs = ProgramsRepo.list();
    const csProg = progs.find(p => (p.internal_name || '').toLowerCase().includes('cs'))?.id;
    const bizProg = progs.find(p => (p.internal_name || '').toLowerCase().includes('business'))?.id;
    CoursesRepo.saveAll([
      {
        id: IdUtil.uid("course"),
        dbId: 1001,
        programId: csProg,
        title: "Intro to Computer Science",
        code: "CS-101",
        college_id: 100,
        subject: "CS",
        number: "101",
        description: "Foundations of computing, algorithms, and problem solving.",
        credits: 3.00,
        expansion: false,
        audit: false,
        created_at: nowIso,
        updated_at: nowIso,
        archive: false,
        alt_number: 0,
        requisites: "None",
        ignore_for_ca: false,
      },
      {
        id: IdUtil.uid("course"),
        dbId: 1002,
        programId: csProg,
        title: "Data Structures",
        code: "CS-201",
        college_id: 100,
        subject: "CS",
        number: "201",
        description: "Abstract data types, complexity, and implementation in modern languages.",
        credits: 4.00,
        expansion: false,
        audit: false,
        created_at: nowIso,
        updated_at: nowIso,
        archive: false,
        alt_number: 0,
        requisites: "CS-101",
        ignore_for_ca: false,
      },
      {
        id: IdUtil.uid("course"),
        dbId: 1003,
        programId: bizProg,
        title: "Principles of Marketing",
        code: "BUS-110",
        college_id: 100,
        subject: "BUS",
        number: "110",
        description: "Core marketing concepts, consumer behavior, and strategy.",
        credits: 3.00,
        expansion: false,
        audit: false,
        created_at: nowIso,
        updated_at: nowIso,
        archive: false,
        alt_number: 0,
        requisites: "None",
        ignore_for_ca: false,
      },
    ]);
  }

  // Seed Sections if empty
  if (SectionsRepo.list().length === 0) {
    const terms = TermsRepo.list();
    const courses = CoursesRepo.list();
    const spring = terms.find(t => t.name === "Spring 2026")?.id || terms[0]?.id || IdUtil.uid("termF");
    const cs101 = courses.find(c => c.code === "CS-101") || courses[0];
    const cs201 = courses.find(c => c.code === "CS-201") || courses[1] || courses[0];
    const nowIso = new Date().toISOString();
    const startDate = terms.find(t => t.id === spring)?.start_date || "2026-01-20";
    const endDate = terms.find(t => t.id === spring)?.end_date || "2026-05-15";
    SectionsRepo.saveAll([
      {
        id: IdUtil.uid("sect"),
        dbId: 2001,
        courseId: cs101?.id || IdUtil.uid("courseF"),
        termId: spring,
        allowRegistration: true,
        meetingInfo: "MWF 9:00–10:15 AM • Main Campus",
        capacity: 30,
        number: "001",
        title: cs101 ? `${cs101.title} 001` : "Section 001",
        start_time: "09:00:00",
        end_time: "10:15:00",
        meeting_day_mon: true,
        meeting_day_wed: true,
        meeting_day_fri: true,
        start_date: startDate,
        end_date: endDate,
        allow_registration: true,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        id: IdUtil.uid("sect"),
        dbId: 2002,
        courseId: cs101?.id || IdUtil.uid("courseF"),
        termId: spring,
        allowRegistration: true,
        meetingInfo: "TR 1:00–2:15 PM • Online",
        capacity: 25,
        number: "002",
        title: cs101 ? `${cs101.title} 002` : "Section 002",
        start_time: "13:00:00",
        end_time: "14:15:00",
        meeting_day_tue: true,
        meeting_day_thu: true,
        start_date: startDate,
        end_date: endDate,
        allow_registration: true,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        id: IdUtil.uid("sect"),
        dbId: 2003,
        courseId: cs201?.id || IdUtil.uid("courseF"),
        termId: spring,
        allowRegistration: true,
        meetingInfo: "MW 2:30–3:45 PM • Engineering Bldg",
        capacity: 28,
        number: "001",
        title: cs201 ? `${cs201.title} 001` : "Section 001",
        start_time: "14:30:00",
        end_time: "15:45:00",
        meeting_day_mon: true,
        meeting_day_wed: true,
        start_date: startDate,
        end_date: endDate,
        allow_registration: true,
        created_at: nowIso,
        updated_at: nowIso,
      },
    ]);
  }

  // Seed High Schools if empty
  if (HighSchoolsRepo.list().length === 0) {
    const nowIso = new Date().toISOString();
    HighSchoolsRepo.saveAll([
      {
        id: IdUtil.uid("hs"),
        dbId: 3001,
        name: "Riverview High",
        schl_name: "Riverview High School",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        phone: "(206) 555-0134",
        county: "King",
        nces_id: "530123",
        nces_schl_id: "530123045678",
        school_type: "Public",
        offers_de: true,
        offers_ap: true,
        offers_ib: false,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        id: IdUtil.uid("hs"),
        dbId: 3002,
        name: "Eastview High",
        schl_name: "Eastview High School",
        city: "Bellevue",
        state: "WA",
        zip: "98004",
        phone: "(425) 555-0199",
        county: "King",
        school_type: "Public",
        offers_de: true,
        offers_ap: false,
        offers_ib: false,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        id: IdUtil.uid("hs"),
        dbId: 3003,
        name: "North Ridge High",
        schl_name: "North Ridge High School",
        city: "Redmond",
        state: "WA",
        zip: "98052",
        phone: "(425) 555-0127",
        county: "King",
        school_type: "Charter",
        charter: true,
        offers_de: true,
        offers_ap: true,
        offers_ib: true,
        created_at: nowIso,
        updated_at: nowIso,
      },
    ]);
  }

  if (existing.length === 0) {
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
      owner_id: 1, owner_type: "College", student_id: 1001, term_id: 202501,
      gender: "Female", citizenship_country: "USA", birth_country: "USA", residency_state: "WA",
      hs_current_grade: "11", county: "King", us_citizen: "Yes", default_consent_method: "Email",
      street1: "123 Main St", city: "Seattle", state: "WA", zip: "98101",
      hs_stud_id: "RV-1001", hs_start_date: "2023-09-01", hs_grad_date: "2027-06-15",
      hs_gpa: 3.45, class_rank: "Top 15%", residency: "In-State", hispanic: false, asian: true
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(10),
      updatedAt: isoDaysAgo(9),
      createdBy: seedUser.id,
      status: "Draft",
      profile: { firstName: "Noah", lastName: "Garcia", dob: "2006-11-02", email: "noah.garcia@example.edu" },
      school: { name: "Eastview High" }, gender: "Male", hs_current_grade: "12", hs_stud_id: "EV-2002"
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(8),
      updatedAt: isoDaysAgo(6),
      createdBy: seedUser.id,
      status: "Submitted",
      profile: { firstName: "Mia", lastName: "Patel", dob: "2007-07-21", email: "mia.patel@example.edu", phone: "555-011-2200" },
      school: { name: "Westfield High" }, gender: "Female", hs_current_grade: "11",
      notes: "Parent approval in next phase."
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(5),
      updatedAt: isoDaysAgo(3),
      createdBy: seedUser.id,
      status: "Submitted",
      profile: { firstName: "Liam", lastName: "Nguyen", dob: "2006-05-30", email: "liam.nguyen@example.edu" }, gender: "Male",
      school: { name: "Central High" }, hs_current_grade: "12"
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(4),
      updatedAt: isoDaysAgo(2),
      createdBy: seedUser.id,
      status: "Draft",
      profile: { firstName: "Sophia", lastName: "Martinez", dob: "2007-12-10", email: "sophia.martinez@example.edu" }, gender: "Female",
      school: { name: "North Ridge High" }, hs_current_grade: "11"
    },
    {
      id: IdUtil.uid("app"),
      createdAt: isoDaysAgo(2),
      updatedAt: isoDaysAgo(1),
      createdBy: seedUser.id,
      status: "Submitted",
      profile: { firstName: "Ethan", lastName: "Kim", dob: "2006-09-18", email: "ethan.kim@example.edu" }, gender: "Male",
      school: { name: "Riverview High" }, hs_current_grade: "12"
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

  // Seed a couple registrations for Phase 2 demo
  // Use current applications; seed registrations only if none exist
  const appsNow = Repository.listApplications();
  if (RegistrationsRepo.list().length === 0 && appsNow.length > 0) {
    const regs: RegistrationRecord[] = [
    {
      id: IdUtil.uid("reg"),
      studentId: (appsNow[2] ?? appsNow[0]).id,
      sectionId: "SEC-101",
      status: "WaitingParent",
      timeline: [
        { id: IdUtil.uid("t"), step: "Student", ownerRole: "Student", state: "Complete", updatedAt: isoDaysAgo(5) },
        { id: IdUtil.uid("t"), step: "Parent", ownerRole: "Parent", state: "Waiting", updatedAt: isoDaysAgo(1) },
        { id: IdUtil.uid("t"), step: "Counselor", ownerRole: "Counselor", state: "NotStarted", updatedAt: isoDaysAgo(1) },
      ],
      history: [
        { id: IdUtil.uid("h"), ts: isoDaysAgo(5), actorRole: "Student", action: "STEP_COMPLETED", meta: { step: "Student" } },
        { id: IdUtil.uid("h"), ts: isoDaysAgo(1), actorRole: "System", action: "STEP_ENTERED", meta: { step: "Parent" } },
      ],
      notifications: [],
    },
    {
      id: IdUtil.uid("reg"),
      studentId: (appsNow[3] ?? appsNow[0]).id,
      sectionId: "SEC-102",
      status: "WaitingCounselor",
      timeline: [
        { id: IdUtil.uid("t"), step: "Student", ownerRole: "Student", state: "Complete", updatedAt: isoDaysAgo(7) },
        { id: IdUtil.uid("t"), step: "Parent", ownerRole: "Parent", state: "Complete", updatedAt: isoDaysAgo(2) },
        { id: IdUtil.uid("t"), step: "Counselor", ownerRole: "Counselor", state: "Waiting", updatedAt: isoDaysAgo(1) },
      ],
      history: [
        { id: IdUtil.uid("h"), ts: isoDaysAgo(7), actorRole: "Student", action: "STEP_COMPLETED", meta: { step: "Student" } },
        { id: IdUtil.uid("h"), ts: isoDaysAgo(2), actorRole: "Parent", action: "STEP_COMPLETED", meta: { step: "Parent" } },
      ],
      notifications: [],
    },
    ];
    RegistrationsRepo.saveAll(regs);
    // seed consent token for WaitingParent
    const parentReg = regs.find(r => r.status === 'WaitingParent')
    if (parentReg) {
      const nowIso = new Date().toISOString()
      const exp = new Date(); exp.setDate(new Date().getDate() + 7)
      ConsentTokensRepo.upsert({ token: IdUtil.uid('consent'), registrationId: parentReg.id, createdAt: nowIso, expiresAt: exp.toISOString() })
    }
  }
}


