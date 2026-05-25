import { SESSION_MAX_AGE_SEC } from "@/lib/auth/constants";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLen);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return decoder.decode(bytes);
}

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET deve ter pelo menos 16 caracteres");
  }
  return encoder.encode(secret);
}

async function hmacSign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    getSecretKey(),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(username: string): Promise<string> {
  const exp = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const payloadB64 = toBase64Url(encoder.encode(`${username}:${exp}`));
  const sig = await hmacSign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf(".");
    if (dot <= 0) return false;

    const payloadB64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = await hmacSign(payloadB64);
    if (sig !== expected) return false;

    const payload = fromBase64Url(payloadB64);
    const sep = payload.lastIndexOf(":");
    if (sep <= 0) return false;

    const exp = Number(payload.slice(sep + 1));
    if (!Number.isFinite(exp) || exp < Date.now()) return false;

    const username = payload.slice(0, sep);
    const expectedUser = process.env.AUTH_USERNAME?.trim();
    return Boolean(username && expectedUser && username === expectedUser);
  } catch {
    return false;
  }
}
