import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserCard from "./_components/user-card";

export default async function DashboardPage() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className=" min-h-screen items-center justify-center">
      
    </div>
  );
}
