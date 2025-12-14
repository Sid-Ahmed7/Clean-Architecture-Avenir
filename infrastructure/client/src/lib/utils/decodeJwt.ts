import { Token } from "@/types/Token";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export const getUserFromToken = (): Token | null => {
  const token = Cookies.get("accessToken");
  if (!token) return null;

  const decoded  = jwtDecode<Token>(token);
  return decoded;
}

export const decodeJwt = (token: string): Token | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<Token>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
