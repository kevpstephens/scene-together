import api from "./api";

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data } = await api.get("/auth/me");
    return data.role === "ADMIN" || data.role === "SUPER_ADMIN";
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
}

export async function getUserRole(): Promise<
  "USER" | "ADMIN" | "SUPER_ADMIN" | null
> {
  try {
    const { data } = await api.get("/auth/me");
    return data.role;
  } catch (error) {
    console.error("Failed to get user role:", error);
    return null;
  }
}
