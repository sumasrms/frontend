"use client";

import { useStudentQuery, useStudentResultsQuery } from "@/data/students";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Smartphone,
  Building2,
  Calendar,
  GraduationCap,
  Award,
  BookOpen,
  FileText,
  TrendingUp,
  User,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  const { data: student, isLoading: studentLoading } =
    useStudentQuery(studentId);
  // Unused results for now, keeping as placeholder
  const { data: _results, isLoading: _resultsLoading } = useStudentResultsQuery(
    student?.id || ""
  );

  if (studentLoading) {
    return <StudentDetailSkeleton />;
  }

  if (!student) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Student Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          The student with ID{" "}
          <span className="font-mono font-bold tracking-tight">
            {studentId}
          </span>{" "}
          could not be found.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const fullName = `${student.user?.firstName || "Student"} ${
    student.user?.lastName || ""
  }`;
  const initials = `${student.user?.firstName?.[0] || ""}${
    student.user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="space-y-6 p-6 pb-20 max-w-7xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/students")}
          className="-ml-2"
        >
          Students
        </Button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {student.matricNumber}
        </span>
      </div>

      {/* Header Profile Section */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent rounded-3xl -m-2 opacity-50 transition-opacity" />
        <div className="relative flex flex-col md:flex-row gap-6 md:items-center">
          <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-2 ring-primary/10">
            <AvatarImage src={student.user?.image || ""} alt={fullName} />
            <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "h-6 px-3 rounded-full font-medium",
                  student.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {student.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-xs uppercase px-1.5 py-0.5 bg-accent rounded">
                  MATRIC
                </span>
                <span className="font-semibold text-foreground tracking-tight">
                  {student.matricNumber}
                </span>
              </div>
              <div className="flex items-center gap-1.5 italic">
                <Building2 className="h-4 w-4" />
                {student.department?.name || student.departmentId}
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                {student.level} Level
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="shadow-sm border-none ring-1 ring-border"
            >
              Edit Record
            </Button>
            <Button className="shadow-md shadow-primary/20">
              Manage Status
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-11">
          <TabsTrigger
            value="overview"
            className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="academics"
            className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Academic Records
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Registered Courses
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            System Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {/* Contact Info */}
            <Card className="md:col-span-1 shadow-sm border-none ring-1 ring-border overflow-hidden">
              <CardHeader className="bg-accent/30 pb-3">
                <CardTitle className="text-sm border-l-2 border-primary pl-3">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-linear-to-br from-primary/10 to-transparent rounded-lg text-primary transition-colors group-hover:bg-primary/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                      EMAIL ADDRESS
                    </p>
                    <p className="text-sm font-medium truncate">
                      {student.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-linear-to-br from-primary/10 to-transparent rounded-lg text-primary transition-colors group-hover:bg-primary/20">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                      PHONE NUMBER
                    </p>
                    <p className="text-sm font-medium">
                      {student.user?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-linear-to-br from-primary/10 to-transparent rounded-lg text-primary transition-colors group-hover:bg-primary/20">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                      GENDER
                    </p>
                    <p className="text-sm font-medium">
                      {student.user?.gender || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Summary */}
            <Card className="md:col-span-2 shadow-sm border-none ring-1 ring-border overflow-hidden">
              <CardHeader className="bg-accent/30 pb-3">
                <CardTitle className="text-sm border-l-2 border-primary pl-3">
                  Academic Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                      CURRENT CGPA
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-primary">
                        {student.cgpa?.toFixed(2) || "0.00"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / 5.00
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                      ADMISSION DATE
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {student.admissionDate
                          ? new Date(student.admissionDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                      EXPECTED GRAD.
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {student.graduationDate
                          ? new Date(
                              student.graduationDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                      CLASS STATUS
                    </p>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">1st Class</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Academic Progress
                    </span>
                    <span className="text-xs text-muted-foreground">
                      80% to Graduation
                    </span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions / Recent Activity */}
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <Card className="shadow-sm border-none ring-1 ring-border">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-sm text-muted-foreground">
                      Detailed result history is available in the Academic
                      Records tab.
                    </p>
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/80"
                    >
                      View All Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-4 space-y-4">
              <Button
                className="w-full justify-start gap-3 h-12 rounded-xl border-none ring-1 ring-border bg-card hover:bg-accent/50 text-foreground"
                variant="outline"
              >
                <FileText className="h-4 w-4 text-primary" /> Download
                Transcript
              </Button>
              <Button
                className="w-full justify-start gap-3 h-12 rounded-xl border-none ring-1 ring-border bg-card hover:bg-accent/50 text-foreground"
                variant="outline"
              >
                <Award className="h-4 w-4 text-primary" /> Generate Certificate
              </Button>
              <Button
                className="w-full justify-start gap-3 h-12 rounded-xl border-none ring-1 ring-border bg-card hover:bg-accent/50 text-foreground"
                variant="outline"
              >
                <BookOpen className="h-4 w-4 text-primary" /> View ID Card
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="academics"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <Card className="border-none ring-1 ring-border shadow-sm">
            <CardHeader>
              <CardTitle>Academic Records</CardTitle>
              <CardDescription>
                Detailed breakdown of scores and grades per semester
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 text-center">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Session-based result records will appear here once the student
                completes a semester.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StudentDetailSkeleton() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <Skeleton className="h-6 w-[200px] mb-8" />
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
      <Separator />
      <Skeleton className="h-11 w-full max-w-md rounded-xl" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] md:col-span-2 rounded-xl" />
      </div>
    </div>
  );
}
