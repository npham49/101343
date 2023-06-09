import { Request } from "express";
import jwt from "jsonwebtoken";

export default async function decode(req: Request, res: any) {
  const splitPem = process.env.CLERK_JWT_VERIFICATION_KEY?.match(/.{1,64}/g);
  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    splitPem?.join("\n") +
    "\n-----END PUBLIC KEY-----";

  const sessToken = req.headers.authorization?.split(" ")[1];
  if (!sessToken) {
    return { error: "No token" };
  }
  let decoded;
  try {
    console.log(publicKey, sessToken);
    decoded = jwt.verify(sessToken || "", publicKey);
  } catch (error) {
    return { error: "Invalid token" };
  }
  return { decoded: decoded };
}
