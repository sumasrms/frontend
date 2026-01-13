"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addGradeScalesAction } from "@/lib/actions/governanceActions";
import { governanceKeys } from "@/data/keys";

const gradeScaleSchema = z.object({
  grade: z.string().min(1, "Grade is required"),
  minScore: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100),
  gradePoint: z.number().min(0),
  description: z.string().optional(),
});

type GradeScaleFormValues = z.infer<typeof gradeScaleSchema>;

interface AddGradeScaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
}

export function AddGradeScaleDialog({
  open,
  onOpenChange,
  departmentId,
}: AddGradeScaleDialogProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<GradeScaleFormValues>({
    resolver: zodResolver(gradeScaleSchema),
    defaultValues: {
      grade: "",
      minScore: 0,
      maxScore: 100,
      gradePoint: 0,
      description: "",
    },
  });

  function onSubmit(data: GradeScaleFormValues) {
    if (data.minScore > data.maxScore) {
        form.setError("minScore", { message: "Min score cannot be greater than max score" });
        return;
    }

    startTransition(async () => {
      const result = await addGradeScalesAction(departmentId, data);

      if (result.success) {
        toast.success("Grade scale added successfully");
        queryClient.invalidateQueries({ queryKey: governanceKeys.department(departmentId) });
        form.reset();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to add grade scale");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Grade Scale</DialogTitle>
          <DialogDescription>
            Define a new grade scale for this department.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                        <Input placeholder="A" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="gradePoint"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                        <Input 
                            type="number" 
                            step="0.1" 
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="minScore"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Min Score</FormLabel>
                    <FormControl>
                        <Input 
                            type="number" 
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="maxScore"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Max Score</FormLabel>
                    <FormControl>
                        <Input 
                            type="number" 
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Excellent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Add Scale" : "Add Scale"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
