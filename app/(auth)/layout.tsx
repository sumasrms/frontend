import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";



export const metadata: Metadata = createMetadata({
  title: {
    template: "%s | Better Auth",
    default: "Better Auth",
  },
  description: "The most comprehensive authentication framework for TypeScript",
  metadataBase: new URL("https://demo.better-auth.com"),
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    {children}
    </>
  );
}
