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
import { updateFacultyAction } from "@/lib/actions/governanceActions";
import { governanceKeys } from "@/data/keys";
import type { Faculty } from "@/lib/types";

const updateFacultySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  deanId: z.string().optional(),
});

type UpdateFacultyFormValues = z.infer<typeof updateFacultySchema>;

interface EditFacultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty;
}

export function EditFacultyDialog({
  open,
  onOpenChange,
  faculty,
}: EditFacultyDialogProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<UpdateFacultyFormValues>({
    resolver: zodResolver(updateFacultySchema),
    defaultValues: {
      name: faculty.name,
      code: faculty.code,
      description: faculty.description || "",
      deanId: faculty.deanId || "",
    },
  });

  // Reset form when faculty changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: faculty.name,
        code: faculty.code,
        description: faculty.description || "",
        deanId: faculty.deanId || "",
      });
    }
  }, [faculty, open, form]);

  function onSubmit(data: UpdateFacultyFormValues) {
    startTransition(async () => {
      const result = await updateFacultyAction(faculty.id, data);

      if (result.success) {
        toast.success("Faculty updated successfully");
        queryClient.invalidateQueries({ queryKey: governanceKeys.faculty(faculty.code) });
        queryClient.invalidateQueries({ queryKey: governanceKeys.faculties() });
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update faculty");
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
          <DialogTitle>Edit Faculty</DialogTitle>
          <DialogDescription>
            Update faculty details.
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
                    <Input placeholder="Faculty of Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="FOS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="The Faculty of Science offers..."
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
              name="deanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dean</FormLabel>
                  <FormControl>
                    <StaffSelect
                      value={field.value}
                      onSelect={(user) => field.onChange(user.id)}
                      placeholder="Select a dean..."
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
