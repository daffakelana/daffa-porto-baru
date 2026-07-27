"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, signToken } from "@/lib/admin/token";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) return { error: "ADMIN_PASSWORD belum diset di server." };
  if (password !== expected) return { error: "Password salah." };

  let token: string;
  try {
    token = await signToken();
  } catch {
    return { error: "ADMIN_SESSION_SECRET belum diset di server." };
  }

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/admin/login");
}