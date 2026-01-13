import { requireAuth } from "@/lib/auth-guards";

export default async function DepartmentPage() {
  await requireAuth();
  return <div>Department Page</div>;
}