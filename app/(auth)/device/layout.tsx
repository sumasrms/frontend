import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default async function DevicePage({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await authClient.getSession();
	if (session === null) {
		throw redirect("/sign-in?callbackUrl=/device");
	}
	return children;
}
