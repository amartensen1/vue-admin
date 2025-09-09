export type ProgramDTO = {
  id: string;
  name: string;
  internal_name?: string;
};

export const programsSeed: ProgramDTO[] = [
  { id: "prog_000001", name: "General Studies", internal_name: "general_studies" },
  { id: "prog_000002", name: "Computer Science", internal_name: "cs" },
  { id: "prog_000003", name: "Business", internal_name: "business" },
];


