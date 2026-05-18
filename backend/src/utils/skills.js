export function normalizeSkills(input) {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : String(input).split(',');
  return [...new Set(arr.map((s) => String(s).trim()).filter(Boolean))];
}

export function lower(arr) {
  return (arr || []).map((s) => String(s).toLowerCase().trim()).filter(Boolean);
}
