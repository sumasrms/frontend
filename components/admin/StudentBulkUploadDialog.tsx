"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react";
import {
  useBulkUploadStudentsMutation,
  useDownloadStudentTemplate,
} from "@/data/students";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function StudentBulkUploadDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { mutate: upload, isPending: isUploading } =
    useBulkUploadStudentsMutation();
  const { mutate: downloadTemplate, isPending: isDownloading } =
    useDownloadStudentTemplate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    upload(formData, {
      onSuccess: () => {
        setOpen(false);
        setFile(null);
      },
    });
  };

  const removeFile = () => setFile(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Students</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Download template to get started
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => downloadTemplate("csv")}
                disabled={isDownloading}
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => downloadTemplate("excel")}
                disabled={isDownloading}
              >
                <Download className="h-3.5 w-3.5" />
                Excel
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-10 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3",
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/50"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">
                      {isDragActive
                        ? "Drop the file here"
                        : "Click or drag file to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports .csv and .xlsx files
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="selected-file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border rounded-xl p-4 flex items-center justify-between bg-accent/50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full h-11"
              disabled={!file || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Students...
                </>
              ) : (
                "Upload Students"
              )}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground px-6">
              By uploading, you agree that the data follows the school&apos;s
              privacy policy and data governance standards.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
