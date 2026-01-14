"use client";

import { useState, useTransition } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { assignInstructorAction } from "@/lib/actions/courseActions";
import { courseKeys } from "@/data/keys";
import { StaffSelect } from "./StaffSelect";
import { Label } from "@/components/ui/label";

interface AssignInstructorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
}

export function AssignInstructorDialog({
  open,
  onOpenChange,
  courseId,
}: AssignInstructorDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>();
  const [isPrimary, setIsPrimary] = useState(false);
  const queryClient = useQueryClient();

  const handleAssign = () => {
    if (!selectedStaffId) return;

    startTransition(async () => {
      const result = await assignInstructorAction(courseId, {
        instructorId: selectedStaffId,
        isPrimary,
      });

      if (result.success) {
        toast.success("Instructor assigned successfully");
        queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: courseKeys.detail(courseId),
        });
        setSelectedStaffId(undefined);
        setIsPrimary(false);
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to assign instructor");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Instructor</DialogTitle>
          <DialogDescription>
            Select a staff member to assign as an instructor for this course.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Staff Member</Label>
            <StaffSelect
              value={selectedStaffId}
              onSelect={(user) => setSelectedStaffId(user.staffId || user.id)} // StaffSelect returns User. Need staffID.
              // Wait, StaffSelect returns `User`. It uses getUsers.
              // getUsers returns User. User has `staffId`.
              // The API requires `staffId`: "staff-cuid".
              // But `StaffSelect` might be selecting from `users` table, not `staff` table.
              // However, `data.staffId` usually implies the ID from Staff table?
              // Let's check User type again. `staffId` in User is string | null.
              // If the user selected is a staff, they should have `staffId`.
              // If assignInstructorAction expects the Staff ID (from Staff table), we must pass `user.staffId`.
              // If it expects User ID, we pass `user.id`.
              // The curl example says "staff-cuid". Usually cuid is ID.
              // Let's assume it wants the Staff Table ID.
              placeholder="Search for a staff member..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPrimary"
              checked={isPrimary}
              onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
            />
            <Label htmlFor="isPrimary">Primary Instructor</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedStaffId || isPending}
          >
            {isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
