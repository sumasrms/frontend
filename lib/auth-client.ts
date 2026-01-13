import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  deviceAuthorizationClient,
  lastLoginMethodClient,
  multiSessionClient,
  oneTapClient,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    passkeyClient(),
    lastLoginMethodClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      promptOptions: {
        maxAttempts: 1,
      },
    }),
    deviceAuthorizationClient(),
    multiSessionClient(),
    twoFactorClient(),
    adminClient(),
    organizationClient(),
  ],
});

// Automatically generate error messages from $ERROR_CODES
const errorMessages: Record<string, string> = Object.fromEntries(
  Object.keys(authClient.$ERROR_CODES).map((code) => [
    code,
    code.replace(/_/g, " ").toLowerCase(),
  ])
);

export const getErrorMessage = (code: string): string => {
  return errorMessages[code] ?? "";
};

export type DeviceSession = Awaited<
  ReturnType<typeof authClient.multiSession.listDeviceSessions>
>["data"];
