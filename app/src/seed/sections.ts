export type SectionDTO = {
  id: string;
  courseId: string;
  termId: string;
  allowRegistration: boolean;
  capacity?: number;
  meetingInfo?: string;
};

export const sectionsSeed: SectionDTO[] = [
  { id: "sect_000001", courseId: "course_000001", termId: "term_000001", allowRegistration: true, capacity: 25, meetingInfo: "MWF 10:00-10:50" },
];


