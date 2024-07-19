import { PersonalityData } from './types';

export function calculateEuclideanDistance(
  p1: PersonalityData,
  p2: PersonalityData,
) {
  return Math.sqrt(
    Math.pow(p1.extroversionIntroversion - p2.extroversionIntroversion, 2) +
      Math.pow(p1.sensingIntuition - p2.sensingIntuition, 2) +
      Math.pow(p1.thinkingFeeling - p2.thinkingFeeling, 2) +
      Math.pow(p1.judgingPerceiving - p2.judgingPerceiving, 2) +
      Math.pow(p1.assertiveTurbulent - p2.assertiveTurbulent, 2),
  );
}
