/**
 * lib/auth.ts — JWT utilities using jose (Edge Runtime compatible)
 *
 * Used by middleware (Edge) and API routes (Node.js).
 * jose is a pure-JS implementation — no Node crypto dependency.
 */
import { jwtVerify, SignJWT } from 'jose';

const getKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // In development, warn; in production, this should always be set
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is not set!');
    }
    console.warn('[auth] JWT_SECRET not set, using insecure fallback');
  }
  return new TextEncoder().encode(secret ?? 'fallback-dev-secret-do-not-use-in-prod');
};

export interface AdminPayload {
  id: string;
  email: string;
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getKey());
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}
