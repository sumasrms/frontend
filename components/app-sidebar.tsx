"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// Type definitions for menu items
type MenuItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  children?: MenuItem[];
};

type MenuSection = {
  label?: string;
  items: MenuItem[];
};

// Menu configuration - tree-based structure
const menuConfig: MenuSection[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Academic",
    items: [
      {
        title: "Governance",
        icon: ShieldCheck,
        children: [
          {
            title: "Faculties",
            url: "/dashboard/governance/faculties",
          },
          {
            title: "Departments",
            url: "/dashboard/governance/departments",
          },
        ],
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
    ],
  },
  {
    label: "People",
    items: [
      {
        title: "Students",
        url: "/dashboard/students",
        icon: GraduationCap,
      },
      {
        title: "Staff",
        url: "/dashboard/staff",
        icon: Users,
      },
      {
        title: "User Management",
        url: "/dashboard/users",
        icon: UserCog,
      },
    ],
  },
  {
    label: "System",
    items: [
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
    ],
  },
];

// Check if a route or any of its children is active
function isRouteActive(item: MenuItem, currentPath: string): boolean {
  if (item.url && currentPath === item.url) return true;
  if (item.children) {
    return item.children.some((child) => isRouteActive(child, currentPath));
  }
  return false;
}

// Find which top-level item should be expanded based on current path
function findActiveParentKey(
  sections: MenuSection[],
  currentPath: string
): string | null {
  for (const section of sections) {
    for (const item of section.items) {
      if (item.children && isRouteActive(item, currentPath)) {
        return item.title;
      }
    }
  }
  return null;
}

// Recursive menu item component
function MenuItemComponent({
  item,
  currentPath,
  openKey,
  onToggle,
  depth = 0,
}: {
  item: MenuItem;
  currentPath: string;
  openKey: string | null;
  onToggle: (key: string) => void;
  depth?: number;
}) {
  const isActive = item.url === currentPath;
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openKey === item.title;
  const isChildActive = hasChildren && isRouteActive(item, currentPath);
  const Icon = item.icon;

  // Item with children (collapsible)
  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={() => onToggle(item.title)}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn(
                "rounded-lg px-3 py-2.5 my-0.5 justify-between",
                isChildActive && "bg-accent"
              )}
              tooltip={item.title}
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                <span className="font-medium">{item.title}</span>
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarMenuSub>
              {item.children!.map((child) => (
                <SidebarMenuSubItem key={child.title}>
                  {child.children ? (
                    <MenuItemComponent
                      item={child}
                      currentPath={currentPath}
                      openKey={openKey}
                      onToggle={onToggle}
                      depth={depth + 1}
                    />
                  ) : (
                    <SidebarMenuSubButton
                      asChild
                      isActive={child.url === currentPath}
                      className="rounded-lg"
                    >
                      <a href={child.url}>
                        {child.icon && <child.icon className="h-4 w-4" />}
                        <span>{child.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  )}
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Regular item (no children)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="rounded-lg px-3 py-2.5 my-0.5"
        tooltip={item.title}
      >
        <a href={item.url}>
          {Icon && <Icon className="h-4 w-4" />}
          <span className="font-medium">{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const currentPath = usePathname();

  // Initialize with active parent key based on current path
  const initialOpenKey = findActiveParentKey(menuConfig, currentPath);
  
  // Accordion state - only one submenu open at a time
  const [openKey, setOpenKey] = useState<string | null>(initialOpenKey);

  const handleToggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <Sidebar
      aria-label="App Sidebar"
      variant="floating"
      className="top-14 h-[calc(100vh-3.5rem)]"
    >
      <SidebarContent className="px-2">
        {menuConfig.map((section, sectionIndex) => (
          <SidebarGroup key={section.label || `section-${sectionIndex}`}>
            {section.label && (
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <MenuItemComponent
                    key={item.title}
                    item={item}
                    currentPath={currentPath}
                    openKey={openKey}
                    onToggle={handleToggle}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
