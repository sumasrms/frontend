"use client";

import { useTransition, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StaffSelect } from "@/components/admin/StaffSelect";
import { updateDepartmentAction } from "@/lib/actions/governanceActions";
import { governanceKeys } from "@/data/keys";
import type { Department } from "@/lib/types";

const updateDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  numberOfYears: z.number().min(1, "Number of years must be at least 1"),
  hodId: z.string().optional(),
});

type UpdateDepartmentFormValues = z.infer<typeof updateDepartmentSchema>;

interface EditDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department;
}

export function EditDepartmentDialog({
  open,
  onOpenChange,
  department,
}: EditDepartmentDialogProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<UpdateDepartmentFormValues>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      name: department.name,
      code: department.code,
      description: department.description || "",
      numberOfYears: department.numberOfYears || 4,
      hodId: department.hodId || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: department.name,
        code: department.code,
        description: department.description || "",
        numberOfYears: department.numberOfYears || 4,
        hodId: department.hodId || "",
      });
    }
  }, [department, open, form]);

  function onSubmit(data: UpdateDepartmentFormValues) {
    startTransition(async () => {
      const result = await updateDepartmentAction(department.id, data);

      if (result.success) {
        toast.success("Department updated successfully");
        queryClient.invalidateQueries({ queryKey: governanceKeys.department(department.id) });
        queryClient.invalidateQueries({ queryKey: governanceKeys.departments() });
        // Invalidate faculty query as well since it lists departments
        if (department.facultyId) {
             queryClient.invalidateQueries({ queryKey: governanceKeys.faculty(department.facultyId) });
        }
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update department");
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, messages]) => {
            form.setError(key as keyof typeof form.formState.defaultValues, {
              message: messages[0],
            });
          });
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update department details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                        <Input placeholder="CSC" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="numberOfYears"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Duration (Years)</FormLabel>
                    <FormControl>
                        <Input 
                            type="number" 
                            min={1}
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Department of..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head of Department</FormLabel>
                  <FormControl>
                    <StaffSelect
                      value={field.value}
                      onSelect={(user) => field.onChange(user.id)}
                      placeholder="Select HOD..."
                    />
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
                {isPending ? "Save Changes" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
