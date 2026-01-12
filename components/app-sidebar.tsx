"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Users,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

// Organized menu items by category
const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

const academicItems = [
  {
    title: "Governance",
    url: "/dashboard/governance",
    icon: ShieldCheck,
  },
  {
    title: "Course Assignment",
    url: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Institution Curriculum",
    url: "/dashboard/curriculum",
    icon: Building2,
  },
];

const peopleItems = [
  {
    title: "Students",
    url: "/dashboard/students",
    icon: GraduationCap,
  },
  {
    title: "Staff",
    url: "/dashboard/staff",
    icon: UserCog,
  },
];

const systemItems = [
  {
    title: "Audits & Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "System Configuration",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const currentPath = usePathname();

  return (
    <Sidebar
      aria-label="App Sidebar"
      variant="floating"
      className="top-14 h-[calc(100vh-3.5rem)]"
    >
      {/* <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg
              className="h-6 w-6 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-foreground">SUMAS-RMS</span>
            <span className="text-xs text-muted-foreground">
              Records Management
            </span>
          </div>
        </div>
      </SidebarHeader> */}

      <SidebarContent className="px-2">
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === currentPath}
                    className="rounded-lg px-3 py-2.5 my-0.5"
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Academic Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
            Academic
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {academicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === currentPath}
                    className="rounded-lg px-3 py-2.5 my-0.5"
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* People Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
            People
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {peopleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === currentPath}
                    className="rounded-lg px-3 py-2.5 my-0.5"
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === currentPath}
                    className="rounded-lg px-3 py-2.5 my-0.5"
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2.5 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-3 py-3 group-data-[collapsible=icon]:px-2">
          <p className="text-xs text-center text-muted-foreground group-data-[collapsible=icon]:hidden">
            © 2024 SUMAS-RMS
          </p>
          <p className="text-xs text-center text-muted-foreground hidden group-data-[collapsible=icon]:block">
            © 2024
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
