import { decodeJwt } from 'jose';

// Only checks shape + expiry. The signature is verified by the API on every
// request, so no secret has to live in the frontend (NEXT_PUBLIC_ leaks it).
export const verifyToken = async (token: string) => {
  try {
    const payload = decodeJwt(token);
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};
