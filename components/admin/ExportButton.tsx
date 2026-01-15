"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExportStudents } from "@/data/students";
import { toast } from "sonner";

interface ExportButtonProps {
  module: "students" | "staff" | "courses";
}

export function ExportButton({ module }: ExportButtonProps) {
  // Currently we only have useExportStudents, but we can expand this
  const { mutate: exportStudents, isPending } = useExportStudents();

  const handleExport = (format: "csv" | "excel") => {
    if (module !== "students") {
      toast.info("Export for this module is coming soon");
      return;
    }

    exportStudents(format, {
      onSuccess: () => {
        toast.success(
          `${
            module.charAt(0).toUpperCase() + module.slice(1)
          } exported successfully`
        );
      },
      onError: (error) => {
        toast.error(`Failed to export ${module}: ${error.message}`);
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
