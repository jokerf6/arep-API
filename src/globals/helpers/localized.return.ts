export function localizedObject(obj: any, locale: string): unknown {
  const targetLanguage = locale?.toLowerCase();

  // Special case: 'admin' locale returns the object as-is
  if (targetLanguage === 'admin') return obj;

  // Base case 1: if not an object or null, return directly
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'bigint') return obj.toString(); // Handle BigInt
    return obj;
  }

  // Base case 2: handle localized objects like { en: 'John', ar: 'جون' }
  const objAsAny = obj as any;
  const isLocalizedObjectCandidate =
    !Array.isArray(objAsAny) && // prevent arrays from being treated as localized objects
    Object.keys(objAsAny).every(
      (key) => key.length === 2 && /^[a-z]{2}$/.test(key)
    );

  if (isLocalizedObjectCandidate) {
    if (typeof objAsAny[targetLanguage] !== 'undefined') {
      return objAsAny[targetLanguage];
    } else {
      return ''; // fallback when target language not found
    }
  }

  // Handle arrays recursively
  if (Array.isArray(obj)) {
    return obj.map((item) => localizedObject(item, targetLanguage));
  }

  // Handle regular objects and nested structures
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = objAsAny[key];
    let newKey = key;

    // Support keys like "nameEn", "nameAr", etc.
    const suffixMatch = key.match(/([A-Z][a-z]{1,2})$/); // e.g., 'En', 'Ar', 'Es'
    if (suffixMatch) {
      const suffix = suffixMatch[1].toLowerCase();
      const baseKey = key.slice(0, -suffix.length);
      if (suffix === targetLanguage) {
        newKey = baseKey;
        newObj[newKey] = localizedObject(value, targetLanguage);
      }
      // Skip keys for other languages
    } else {
      newObj[newKey] = localizedObject(value, targetLanguage);
    }
  }

  return newObj;
}
