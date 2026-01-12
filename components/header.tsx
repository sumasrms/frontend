"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import AccountSwitcher from "./account-switch";
import { authClient } from "@/lib/auth-client";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { AutoBreadcrumb } from "./auto-breadcrumb";

const Header = () => {
  const { data: session } = authClient.useSession();
  const sessions = {
    label: "2023/2024",
    semester: "Semester 1",
    status: "Active",
  };

  return (
    <header className="h-14 bg-background border-b flex gap-5 justify-between items-center border-border fixed top-0 z-50 w-full px-4">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Logo />
          <p className="select-none font-bold">SUMAS RMS</p>
        </div>
      </Link>
      <div className="min-w-0 flex-1">
        <AutoBreadcrumb />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-linear-to-br from-background to-muted/30 shadow-sm">
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Academic Session
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-semibold text-foreground">
                {sessions.label}
              </span>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-xs text-muted-foreground">
                {sessions.semester}
              </span>
              <Badge
                variant="outline"
                className="ml-1 px-1.5 py-0 text-[10px] bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400"
              >
                {sessions.status}
              </Badge>
            </div>
          </div>
        </div>
        {session && <AccountSwitcher initialSession={session} />}
      </div>
    </header>
  );
};

export default Header;
