export function toLowerCaseString(input: string) {
  if (input) return input.toLowerCase();
}

export function toCapitalizedString(input: string) {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
