import { jwtDecode } from "jwt-decode";

export function decodeJwt(token) {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("JWT decode error:", err);
    throw err;
  }
}
