const evaluatePasswordScore = (password: string) => {
  let score = 0;
  if (password.length > 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

export const evaluatePasswordStrength = (password: string | null): string => {
  if (!password) return '';

  const score = evaluatePasswordScore(password);
  switch (score) {
    case 1:
    case 2:
      return 'Weak';
    case 3:
    case 4:
      return 'Medium';
    case 5:
      return 'Strong';
    default:
      return '';
  }
};
