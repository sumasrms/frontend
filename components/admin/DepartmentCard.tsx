import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconChevronRight,
  IconSchool,
  IconUser,
} from "@tabler/icons-react";
import type { Department } from "@/lib/types";

export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Link
      href={`/dashboard/governance/departments/${department.code}`}
      className="group block"
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {department.code}
            </Badge>
            <IconChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <h3 className="font-semibold text-lg leading-tight mt-2 line-clamp-2">
            {department.name}
          </h3>
          {department.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {department.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
            {/* Faculty Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <IconSchool className="h-4 w-4" />
                <span className="truncate">{department.faculty?.name || "Unknown Faculty"}</span>
            </div>

          {/* HOD Section */}
          <div className="flex items-center gap-3 pt-3 border-t">
            {department.hod ? (
              <>
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={department.hod?.image || undefined} />
                  <AvatarFallback className="text-xs bg-primary/10">
                    {department.hod?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground">HOD</span>
                  <span className="text-sm font-medium truncate">
                    {department.hod?.name}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-8 w-8 rounded-full border border-dashed flex items-center justify-center">
                  <IconUser className="h-4 w-4" />
                </div>
                <span className="text-sm">No HOD assigned</span>
              </div>
            )}
          </div>
          
           {/* Stats */}
           <div className="grid grid-cols-2 gap-2 mt-4">
             <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <IconSchool className="h-3 w-3" />
                <span>{department._count?.courses ?? 0} Courses</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <IconUser className="h-3 w-3" />
                <span>{department._count?.students ?? 0} Students</span>
             </div>
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function DepartmentCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-3/4 mt-2" />
        <Skeleton className="h-4 w-full mt-1" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-4 w-1/2 mb-4 bg-muted animate-pulse rounded" />
        <div className="flex items-center gap-3 pt-3 border-t">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
