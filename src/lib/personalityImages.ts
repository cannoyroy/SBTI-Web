const externalImageMap: Record<string, string> = {
  zzzz: 'https://picturebed.xhyun.eu.cc/uploads/aff8350ee4a84607.png',
  shit: 'https://picturebed.xhyun.eu.cc/uploads/9c1a5c00de304967.png',
  fuck: 'https://picturebed.xhyun.eu.cc/uploads/6ceabdf1968d407a.png',
  'atm-er': 'https://picturebed.xhyun.eu.cc/uploads/9394bff90de94552.png',
};

export const normalizePersonalityCode = (code: string) => {
  return code
    .trim()
    .toLowerCase()
    .replace(/!/g, '')
    .replace(/[^a-z0-9-]/g, '');
};

export const getPersonalityImagePath = (code: string) => {
  const normalizedCode = normalizePersonalityCode(code);
  return externalImageMap[normalizedCode] ?? `/personality-images/${normalizedCode}.png`;
};
