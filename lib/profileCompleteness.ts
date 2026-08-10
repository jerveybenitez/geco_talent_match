export interface ProfileCompletenessFields {
  name: string;
  phone: string | null;
  city: string;
  countryId: string;
  hasLanguage: boolean;
  roleTitle: string;
  linkedin: string | null;
  hasSkill: boolean;
  hasIndustry: boolean;
  yearsOfExperience: number | string | null;
}

export interface ProfileCompleteness {
  completed: number;
  total: number;
  percentage: number;
}

/**
 * The 12 fields that count toward a talent profile being "complete": full name,
 * phone, email (always present/required, not user-editable here), city, country,
 * at least one language, role/title, linkedin, at least one skill, at least one
 * industry, years of experience, and at least one CV (always unmet - not built yet).
 */
export function computeProfileCompleteness(fields: ProfileCompletenessFields): ProfileCompleteness {
  const hasYearsOfExperience =
    fields.yearsOfExperience !== null &&
    fields.yearsOfExperience !== undefined &&
    String(fields.yearsOfExperience).trim() !== "";

  const checks = [
    !!fields.name.trim(),
    !!fields.phone?.trim(),
    true, // email is required and can't be changed
    !!fields.city.trim(),
    !!fields.countryId,
    fields.hasLanguage,
    !!fields.roleTitle.trim(),
    !!fields.linkedin?.trim(),
    fields.hasSkill,
    fields.hasIndustry,
    hasYearsOfExperience,
    false, // CV/documents upload isn't available yet
  ];

  const completed = checks.filter(Boolean).length;
  const total = checks.length;
  return { completed, total, percentage: Math.round((completed / total) * 100) };
}
