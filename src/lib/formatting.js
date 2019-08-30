export function formattedNumber(number) {
  return new Intl.NumberFormat('en').format(number);
}

export function formattedDate(date) {
  return date.toISOString().split('T')[0];
}
