import { oauthProviderClient } from "@better-auth/oauth-provider/client";
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
import { oidcProvider } from "better-auth/plugins";

const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL // Server side: hit backend directly
    : ""; // Client side: hit relative path (proxy)

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    credentials: "include",
  },
  oidcProvider,
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
    oauthProviderClient(),
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
