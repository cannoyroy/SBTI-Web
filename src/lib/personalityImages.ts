export const normalizePersonalityCode = (code: string) => {
  return code
    .trim()
    .toLowerCase()
    .replace(/!/g, '')
    .replace(/[^a-z0-9-]/g, '');
};

export const getPersonalityImagePath = (code: string) => {
  return `/personality-images/${normalizePersonalityCode(code)}.png`;
};
