export type TermDTO = {
  id: string;
  name: string;
  isActive: boolean;
  customDates?: Record<string, string>;
};

export const termsSeed: TermDTO[] = [
  { id: "term_000001", name: "Fall 2024", isActive: true, customDates: { registrationStart: "2024-08-01", registrationEnd: "2024-09-15" } },
  { id: "term_000002", name: "Spring 2025", isActive: false },
];


