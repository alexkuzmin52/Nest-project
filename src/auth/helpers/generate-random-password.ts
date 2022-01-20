export const generateRandomPassword = (n: number): string => {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let password = '';
  for (let i = 0; i < n; i++) {
    const pos = Math.floor(Math.random() * chars.length);
    password += chars.substring(pos, pos + 1);
  }
  return password;
};
