"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import SignIn from "@/app/(auth)/sign-in/_components/sign-in";
import { Tabs } from "@/components/ui/tabs2";
import { authClient } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";

export default function Page() {
	const router = useRouter();
	const params = useSearchParams();

	useEffect(() => {
		authClient.oneTap({
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message || "An error occurred");
				},
				onSuccess: () => {
					toast.success("Successfully signed in");
					router.push(getCallbackURL(params));
				},
			},
		});
	}, [params, router]);

	return (
		<div className="w-full">
			<div className="flex items-center flex-col justify-center w-full md:py-10">
				<div className="w-full max-w-md">
					<Tabs
					containerClassName="rounded-t-md"
					activeTabClassName="rounded-t-md"
					contentClassName="rounded-md"
						tabs={[
							{
								title: "Sign In",
								value: "sign-in",
								content: <SignIn />,
							}
						]}
					/>
				</div>
			</div>
		</div>
	);
}
