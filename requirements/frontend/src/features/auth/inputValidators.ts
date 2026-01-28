// export function isValidEmail(value: string): boolean {
//   const v = value.trim();
//   const re = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
//   return re.test(v);
// }

// export function validateEmail(value: string): string {
//   if (!value.trim()) return "Email is required";
//   if (!isValidEmail(value)) return "Enter a valid email (example: john@domain.com)";
//   return "";
// }

// Matches server and NestJS @IsEmail()
export function validateEmail(value: string): string {
  const v = value.trim();

  if (!v) return "Email is required user@example.com";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(v)) return "Enter a valid email address";

  return "";
}

export function validatePassword(value: string): string {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return "";
}


// Matches server and NestJS:
// @IsString()
// @MinLength(2)
// @MaxLength(20)
export function validateUsername(value: string){
  const v = value.trim();

  if (!v) return "Username is required";
  if (v.length < 2) return "Username must be at least 2 characters"; 
  if (v.length > 20) return "Username must be at most 20 characters";

  return "";
}