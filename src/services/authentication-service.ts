import { jwtDecode } from "jwt-decode";

export function isAdmin(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.role === "Admin";
  } catch (error) {
    return false;
  }
}
