import { Authority, ScholarshipProgram, UserProfile } from './types';

export interface MatchResult {
  score: number; // 0 - 100
  isEligible: boolean;
  tag: 'Perfect Match' | 'High Match' | 'Eligible' | 'Competitive' | 'Requires Improvement';
  reasons: string[];
  warnings: string[];
}

export function calculateAuthorityMatch(authority: Authority, profile: UserProfile): MatchResult {
  if (!profile.cgpa || profile.cgpa <= 0) {
    return {
      score: 60,
      isEligible: true,
      tag: 'Eligible',
      reasons: ['Set your CGPA in profile to view personalized match scoring'],
      warnings: [],
    };
  }

  let score = 50; // baseline
  const reasons: string[] = [];
  const warnings: string[] = [];

  // 1. CGPA evaluation
  if (profile.cgpa >= authority.minCgpaRecommendation) {
    score += 25;
    reasons.push(`Your CGPA (${profile.cgpa.toFixed(2)}) meets the recommended threshold (≥ ${authority.minCgpaRecommendation.toFixed(2)})`);
  } else if (profile.cgpa >= authority.minCgpaRecommendation - 0.3) {
    score += 10;
    warnings.push(`CGPA is slightly below ideal (${profile.cgpa.toFixed(2)} vs ${authority.minCgpaRecommendation.toFixed(2)}), compensate with strong projects/experience`);
  } else {
    warnings.push(`Competitive track: Recommended CGPA is ≥ ${authority.minCgpaRecommendation.toFixed(2)}`);
  }

  // 2. Country preference match
  if (profile.preferredCountries.some(c => c.toLowerCase() === authority.country.toLowerCase())) {
    score += 15;
    reasons.push(`${authority.country} is in your preferred countries list`);
  }

  // 3. GRE status
  if (!authority.greRequired) {
    score += 10;
    reasons.push('No GRE required for this authority / country track');
  } else if (profile.greQuant && profile.greQuant >= 160) {
    score += 10;
    reasons.push(`Strong GRE Quantitative score (${profile.greQuant})`);
  }

  // 4. IELTS evaluation
  if (profile.ieltsScore && profile.ieltsScore >= authority.ieltsRecommended) {
    score += 10;
    reasons.push(`IELTS score (${profile.ieltsScore}) meets English requirement (≥ ${authority.ieltsRecommended})`);
  }

  // Clamp score
  const finalScore = Math.min(Math.max(score, 30), 99);

  let tag: MatchResult['tag'] = 'Eligible';
  if (finalScore >= 90) tag = 'Perfect Match';
  else if (finalScore >= 80) tag = 'High Match';
  else if (finalScore >= 65) tag = 'Eligible';
  else if (finalScore >= 50) tag = 'Competitive';
  else tag = 'Requires Improvement';

  return {
    score: finalScore,
    isEligible: profile.cgpa >= authority.minCgpaRecommendation - 0.4,
    tag,
    reasons,
    warnings,
  };
}

export function calculateScholarshipMatch(scholarship: ScholarshipProgram, profile: UserProfile): MatchResult {
  let score = 50;
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (profile.cgpa >= scholarship.minCgpa) {
    score += 25;
    reasons.push(`CGPA (${profile.cgpa.toFixed(2)}) meets minimum (${scholarship.minCgpa.toFixed(2)})`);
  } else {
    score -= 20;
    warnings.push(`Minimum CGPA requirement is ${scholarship.minCgpa.toFixed(2)}`);
  }

  if (profile.preferredCountries.some(c => c.toLowerCase() === scholarship.country.toLowerCase())) {
    score += 15;
    reasons.push(`Located in your preferred country (${scholarship.country})`);
  }

  if (!scholarship.greRequired) {
    score += 10;
    reasons.push('No GRE exam required');
  }

  if (profile.ieltsScore && profile.ieltsScore >= scholarship.ieltsMin) {
    score += 10;
    reasons.push(`IELTS meets requirement (≥ ${scholarship.ieltsMin})`);
  }

  const finalScore = Math.min(Math.max(score, 25), 99);

  let tag: MatchResult['tag'] = 'Eligible';
  if (finalScore >= 90) tag = 'Perfect Match';
  else if (finalScore >= 80) tag = 'High Match';
  else if (finalScore >= 65) tag = 'Eligible';
  else tag = 'Competitive';

  return {
    score: finalScore,
    isEligible: profile.cgpa >= scholarship.minCgpa,
    tag,
    reasons,
    warnings,
  };
}
