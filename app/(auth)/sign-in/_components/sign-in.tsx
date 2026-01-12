"use client";

import { Key } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SignInForm } from "@/components/forms/sign-in-form";
import { LastUsedIndicator } from "@/components/last-used-indicator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";
import { cn } from "@/lib/utils";

export default function SignIn() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <Card className="w-full rounded-none rounded-tr-md rounded-b-md max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <SignInForm
            onSuccess={() => router.push(getCallbackURL(params))}
            callbackURL="/dashboard"
			showPasswordToggle
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Passkey Login */}
          <Button
            variant="outline"
            className={cn("w-full gap-2 flex items-center relative")}
            onClick={async () => {
              await authClient.signIn.passkey({
                fetchOptions: {
                  onSuccess() {
                    toast.success("Successfully signed in");
                    router.push(getCallbackURL(params));
                  },
                  onError(context) {
                    toast.error(
                      "Authentication failed: " + context.error.message
                    );
                  },
                },
              });
            }}
          >
            <Key size={16} />
            <span>Sign in with Passkey</span>
            {authClient.isLastUsedLoginMethod("passkey") && (
              <LastUsedIndicator />
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t pt-4">
          <p className="text-center text-xs text-neutral-500">
            built by{" "}
            <Link
              href="https://thirtn.com"
              className="underline"
              target="_blank"
            >
              <span className="dark:text-white/70 cursor-pointer">thirtn.</span>
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
