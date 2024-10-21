export const PartTypes = {
  Wheel: "wheel",
  Door: "door",
  Window: "window",
} as const;

export type PartType = (typeof PartTypes)[keyof typeof PartTypes];
