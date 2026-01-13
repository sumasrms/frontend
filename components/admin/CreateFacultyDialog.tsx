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
import { createFacultyAction } from "@/lib/actions/governanceActions";
import { governanceKeys } from "@/data/keys";

const createFacultySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  deanId: z.string().optional(),
});

type CreateFacultyFormValues = z.infer<typeof createFacultySchema>;

interface CreateFacultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFacultyDialog({
  open,
  onOpenChange,
}: CreateFacultyDialogProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<CreateFacultyFormValues>({
    resolver: zodResolver(createFacultySchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      deanId: "",
    },
  });

  function onSubmit(data: CreateFacultyFormValues) {
    startTransition(async () => {
      const result = await createFacultyAction(data);

      if (result.success) {
        toast.success("Faculty created successfully");
        queryClient.invalidateQueries({ queryKey: governanceKeys.faculties() });
        form.reset();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to create faculty");
        if (result.errors) {
          // Flatten errors and set them on the form
          Object.entries(result.errors).forEach(([key, messages]) => {
            form.setError(key as keyof CreateFacultyFormValues, {
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
          <DialogTitle>Create Faculty</DialogTitle>
          <DialogDescription>
            Add a new faculty to the university.
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
                  <FormLabel>Dean (Optional)</FormLabel>
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
                {isPending ? "Creating..." : "Create Faculty"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
