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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StaffSelect } from "@/components/admin/StaffSelect";
import { createDepartmentAction } from "@/lib/actions/governanceActions";
import { governanceKeys } from "@/data/keys";
import { useFacultiesQuery } from "@/data/governance";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
  

const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  facultyId: z.string().min(1, "Faculty is required"),
  numberOfYears: z.number().min(1, "Number of years must be at least 1"),
  hodId: z.string().optional(),
});

type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>;

interface CreateDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facultyId?: string; // Optional pre-selected faculty
}

export function CreateDepartmentDialog({
  open,
  onOpenChange,
  facultyId,
}: CreateDepartmentDialogProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { data: facultiesData } = useFacultiesQuery({ limit: 100 }); // Fetch faculties for selection if not provided

  const form = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      facultyId: facultyId || "",
      numberOfYears: 4,
      hodId: "",
    },
  });

  function onSubmit(data: CreateDepartmentFormValues) {
    startTransition(async () => {
      const result = await createDepartmentAction(data);

      if (result.success) {
        toast.success("Department created successfully");
        queryClient.invalidateQueries({ queryKey: governanceKeys.departments() });
        if (facultyId) {
            queryClient.invalidateQueries({ queryKey: governanceKeys.faculty(facultyId) });
        }
        form.reset();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to create department");
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
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Add a new department to the faculty.
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
                            placeholder="4"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {!facultyId && (
                <FormField
                control={form.control}
                name="facultyId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Faculty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {facultiesData?.data.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.id}>
                                    {faculty.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}

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
                  <FormLabel>Head of Department (Optional)</FormLabel>
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
                {isPending ? "Creating..." : "Create Department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
