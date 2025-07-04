import { jwtVerify } from 'jose';

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET),
    );
    return payload;
  } catch (err) {
    console.log('verifyToken: ' + err);
    return null;
  }
};
