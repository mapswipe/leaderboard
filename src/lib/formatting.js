export function formattedNumber(number) {
  return new Intl.NumberFormat('en').format(number || 0);
}

export function formattedDate(date) {
  return date.toISOString().split('T')[0];
}
