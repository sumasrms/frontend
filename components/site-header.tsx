"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { AutoBreadcrumb } from "./auto-breadcrumb";

// AutoBreadcrumb component using shadcn breadcrumb


export function SiteHeader() {
  // Simulated user data (replace with real user data as needed)
  const user = {
    name: "Collins N.",
    email: "collins@example.com",
    image: "https://github.com/shadcn.png",
  };
  const session = {
    label: "2023/2024",
    semester: "Semester 1",
    status: "Active",
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        {/* Sidebar trigger and breadcrumb */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <div className="min-w-0 flex-1">
            <AutoBreadcrumb />
          </div>
        </div>

        {/* Right side: Session badge and user menu */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Session badge - hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Academic Session
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    {session.label}
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="text-xs text-muted-foreground">
                    {session.semester}
                  </span>
                  <Badge 
                    variant="outline" 
                    className="ml-1 px-1.5 py-0 text-[10px] bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400"
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
            </div>

          {/* Avatar and dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                aria-label="Open user menu" 
                className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <Avatar className="h-9 w-9 border-2 border-primary/10">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
              <DropdownMenuLabel className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              {/* Session info on mobile */}
              <div className="lg:hidden px-2 py-2">
                <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-muted/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Session
                    </span>
                    <span className="text-xs font-medium">
                      {session.label} - {session.semester}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="px-1.5 py-0 text-[10px] bg-green-500/10 text-green-700 border-green-500/20"
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer" 
                asChild
              >
                <button className="w-full text-left">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}