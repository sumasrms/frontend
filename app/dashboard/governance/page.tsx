import { requireAuth } from "@/lib/auth-guards";
import { GovernanceContent } from "./_components/governance-content";

export default async function GovernancePage() {
  await requireAuth();
  return <GovernanceContent />;
}
