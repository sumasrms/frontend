import { requireAuth } from "@/lib/auth-guards";
import { GovernanceContent } from "./_components/governance-content";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default async function GovernancePage() {
  const { data: session } = await authClient.getSession();
    if (!session) {
      console.log({session})
      redirect("/");
    }
  
  return <GovernanceContent />;
}
