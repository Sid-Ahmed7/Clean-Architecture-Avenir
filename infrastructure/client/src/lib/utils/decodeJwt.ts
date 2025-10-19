import { Token } from "@/types/token";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export const getUserFromToken = (): Token | null => {
  const token = Cookies.get("accessToken");
  if (!token) return null;

  const decoded  = jwtDecode<Token>(token);
  return decoded;

}
