export type CourseDTO = {
  id: string;
  title: string;
  programId?: string;
  code?: string;
};

export const coursesSeed: CourseDTO[] = [
  { id: "course_000001", title: "Intro to Computer Science", code: "CS-101", programId: "prog_000002" },
  { id: "course_000002", title: "Data Structures", code: "CS-201", programId: "prog_000002" },
  { id: "course_000003", title: "Principles of Business", code: "BUS-101", programId: "prog_000003" },
];


