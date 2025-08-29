export function normalizeSomaliPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.startsWith('252')) {
    return '+' + cleaned;
  }

  if (cleaned.startsWith('0')) {
    return '+252' + cleaned.substring(1);
  }

  if (cleaned.length > 0 && !cleaned.startsWith('+252')) {
    return '+252' + cleaned;
  }

  // Return the cleaned number if it's just '252' or empty
  if (cleaned.length <= 3) {
    return cleaned;
  }

  return '+' + cleaned;
}
