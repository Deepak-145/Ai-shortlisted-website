import { lower } from '../utils/skills.js';

/**
 * Score = 70 * (required overlap) + 20 * (preferred overlap) + 10 * (experience bonus)
 * Experience bonus = clamp((exp - minExp) / max(minExp, 5), 0, 1)
 * If required is empty, full 70 points awarded.
 */
export function scoreCandidates(candidates, { required, preferred, minExperience }) {
  const req = lower(required);
  const pref = lower(preferred);

  return candidates
    .map((c) => {
      const skills = lower(c.skills);
      const matchedRequired = req.filter((s) => skills.includes(s));
      const matchedPreferred = pref.filter((s) => skills.includes(s));

      const reqScore = req.length === 0 ? 1 : matchedRequired.length / req.length;
      const prefScore = pref.length === 0 ? 0 : matchedPreferred.length / pref.length;
      const expBonus = Math.max(
        0,
        Math.min(1, (c.experience - minExperience) / Math.max(minExperience, 5))
      );

      const matchPercent = Math.round(reqScore * 70 + prefScore * 20 + expBonus * 10);
      const meetsExperience = c.experience >= minExperience;

      return {
        candidate: c,
        matchPercent,
        matchedSkills: [...new Set([...matchedRequired, ...matchedPreferred])],
        missingRequired: req.filter((s) => !skills.includes(s)),
        meetsExperience,
        tier: matchPercent >= 75 ? 'high' : matchPercent >= 50 ? 'medium' : 'low',
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
