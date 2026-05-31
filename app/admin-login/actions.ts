"use server";

import { cookies } from "next/headers";

export async function loginAdmin(passkey: string) {
  const systemPasskey = process.env.ADMIN_PASSKEY || "admin123";
  
  if (passkey === systemPasskey) {
    const cookieStore = await cookies();
    cookieStore.set("admin_authorized", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax"
    });
    return { success: true };
  }
  
  return { success: false, error: "Invalid admin passkey. Please try again." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_authorized");
  return { success: true };
}
