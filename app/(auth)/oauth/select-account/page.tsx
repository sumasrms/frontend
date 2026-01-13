import { authClient } from "@/lib/auth-client";
import type { Metadata } from "next";
// import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnotherAccountBtn, SelectAccountBtn } from "./account-button";

export const metadata: Metadata = {
	title: "Select Account",
	description: "Select account to authorize this application",
};

export default async function SelectAccountPage() {
	const { data: sessions } = await authClient.multiSession.listDeviceSessions();
	return (
		<div className="w-full">
			<div className="flex items-center flex-col justify-center w-full md:py-10">
				   <div className="md:w-100">
					<Card className="w-full bg-zinc-900 border-zinc-800 rounded-none">
						<CardHeader>
							<CardTitle className="text-lg md:text-xl">
								Select Account
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							   {sessions?.map((s: { session: { id?: string } }, i: number) => (
								   <SelectAccountBtn key={s.session.id ?? i} session={s} />
							   ))}
						</CardContent>
						<AnotherAccountBtn />
					</Card>
				</div>
			</div>
		</div>
	);
}
