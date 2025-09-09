export const delay = (ms = 120 + Math.random() * 300): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));


