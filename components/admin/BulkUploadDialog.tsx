"use client";

import { useState, useTransition } from "react";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { bulkUploadStaffAction } from "@/lib/actions/staffActions";
import { useDownloadTemplate } from "@/data/staff";
import { staffKeys } from "@/data/keys";
import type { BulkUploadResult } from "@/lib/types";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkUploadDialog({
  open,
  onOpenChange,
}: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(
    null
  );
  const queryClient = useQueryClient();
  const downloadTemplate = useDownloadTemplate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();
      if (ext === "csv" || ext === "xlsx" || ext === "xls") {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error("Please select a CSV or Excel file");
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await bulkUploadStaffAction(formData);

      if (result.success && result.data) {
        setUploadResult(result.data);
        queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
        queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
        toast.success(
          `Successfully uploaded ${result.data.successCount} staff members`
        );

        if (result.data.failureCount > 0) {
          toast.warning(`${result.data.failureCount} records failed to upload`);
        }
      } else {
        toast.error(result.error || "Failed to upload file");
      }
    });
  };

  const handleDownloadTemplate = (format: "csv" | "excel") => {
    downloadTemplate.mutate(format, {
      onSuccess: () => {
        toast.success(`Template downloaded successfully`);
      },
      onError: () => {
        toast.error("Failed to download template");
      },
    });
  };

  const handleClose = () => {
    setFile(null);
    setUploadResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Staff</DialogTitle>
          <DialogDescription>
            Upload multiple staff members from a CSV or Excel file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template Section */}
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <h4 className="font-medium">Download Template</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Download a template file to see the required format
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadTemplate("csv")}
                disabled={downloadTemplate.isPending}
              >
                <FileText className="mr-2 h-4 w-4" />
                CSV Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadTemplate("excel")}
                disabled={downloadTemplate.isPending}
              >
                <FileText className="mr-2 h-4 w-4" />
                Excel Template
              </Button>
            </div>
          </div>

          {/* Upload Section */}
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <h4 className="font-medium">Upload File</h4>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Upload Summary:</p>
                  <ul className="text-sm space-y-1">
                    <li>Total Processed: {uploadResult.totalProcessed}</li>
                    <li className="text-green-600">
                      Successful: {uploadResult.successCount}
                    </li>
                    {uploadResult.failureCount > 0 && (
                      <li className="text-destructive">
                        Failed: {uploadResult.failureCount}
                      </li>
                    )}
                  </ul>
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-sm">Errors:</p>
                      <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                        {uploadResult.errors.slice(0, 10).map((error, idx) => (
                          <li key={idx} className="text-destructive">
                            Row {error.row}: {error.message}
                          </li>
                        ))}
                        {uploadResult.errors.length > 10 && (
                          <li className="text-muted-foreground">
                            ... and {uploadResult.errors.length - 10} more
                            errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {uploadResult ? "Close" : "Cancel"}
          </Button>
          {!uploadResult && (
            <Button onClick={handleUpload} disabled={!file || isPending}>
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
