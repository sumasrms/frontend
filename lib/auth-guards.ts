import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const { data: session } = await authClient.getSession();

  if (!session) {
    redirect("/");
  }

  return session;
}

export async function requireGuest() {
  const { data: session } = await authClient.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return session;
}
