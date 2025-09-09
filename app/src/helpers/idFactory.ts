export const idFactory = (prefix: string): string => {
  const rand = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${prefix}_${rand}`;
};


