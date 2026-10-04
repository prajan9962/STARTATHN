/**
 * Normalizes participant full name into proper title case while
 * preserving intentional capitalizations (such as initials "L", "De Silva", "McDonald", "O'Connor").
 */
export function normalizeFullName(rawName: string): string {
  if (!rawName) return '';
  let trimmed = rawName.trim().replace(/\s+/g, ' ');

  // Strip leading title prefix if the user typed it into the full name input
  trimmed = trimmed.replace(/^(mr\.|ms\.|dr\.|mrs\.|prof\.)\s+/i, '');

  // Split by whitespace
  const words = trimmed.split(' ');
  const normalizedWords = words.map(word => {
    // If the word has special mixed case already like McDonald or O'Connor, leave it
    if (/^[a-z]+[A-Z]/.test(word) || /^[A-Z][a-z]+[A-Z]/.test(word)) {
      return word;
    }
    // If all lowercase or all uppercase
    if (word === word.toLowerCase() || (word.length > 2 && word === word.toUpperCase())) {
      // Capitalize first letter, lowercase rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    // Single letter uppercase (like initials "L" or "P")
    if (word.length <= 2) {
      return word.toUpperCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return normalizedWords.join(' ');
}

export function normalizeDepartment(dept: string): string {
  if (!dept) return '';
  return dept.trim().replace(/\s+/g, ' ');
}

export function normalizeTeamName(team: string): string {
  if (!team) return '';
  return team.trim().replace(/\s+/g, ' ');
}

export function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Sanitizes participant name for inclusion in safe PDF filename.
 * Example: "Prajan L." -> "Prajan_L"
 */
export function sanitizeFilename(certId: string, name: string): string {
  const safeName = name
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_');
  const safeId = certId.replace(/[^\w-]/g, '');
  return `STARTATHON_2026_${safeId}_${safeName}.pdf`;
}
