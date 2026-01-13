import { cookies } from "next/headers";
import type { Metadata } from "next";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
export const metadata: Metadata = {
  title: "SUMAS-RMS | UNIVERSITY PORTAL",
  description: "SUMAS-RMS University Portal for Managing Student Records",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true" || true;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen}
    >
      <AppSidebar />
      <SidebarInset>
        {/* <SiteHeader /> */}
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
