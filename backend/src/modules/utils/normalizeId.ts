export const normalizeId = (
  id: string | string[]
): string | null => {
  if (Array.isArray(id)) return null;
  return id;
};