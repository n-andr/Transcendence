export function isValidEmail(value: string): boolean {
  const v = value.trim();
  const re = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
  return re.test(v);
}

export function validateEmail(value: string): string {
  if (!value.trim()) return "Email is required";
  if (!isValidEmail(value)) return "Enter a valid email (example: john@domain.com)";
  return "";
}

export function validatePassword(value: string): string {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return "";
}
