/** Comparação em tempo constante (sem node:crypto — compatível com middleware/edge) */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_USERNAME?.trim() &&
      process.env.AUTH_PASSWORD &&
      process.env.AUTH_SECRET &&
      process.env.AUTH_SECRET.length >= 16
  );
}

export function validateCredentials(username: string, password: string): boolean {
  if (!isAuthConfigured()) return false;

  const expectedUser = process.env.AUTH_USERNAME!.trim();
  const expectedPass = process.env.AUTH_PASSWORD!;

  return safeEqual(username.trim(), expectedUser) && safeEqual(password, expectedPass);
}
