"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDepartmentsQuery } from "@/data/governance";
import type { Department } from "@/lib/types";

interface DepartmentSelectProps {
  value?: string;
  onSelect: (department: Department) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DepartmentSelect({
  value,
  onSelect,
  placeholder = "Select department...",
  disabled,
}: DepartmentSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useDepartmentsQuery({
    search: debouncedSearch,
    limit: 100,
  });

  const selectedDepartment = React.useMemo(() => {
    if (!value || !data?.data) return undefined;
    return data.data.find((dept) => dept.code === value);
  }, [value, data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedDepartment ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedDepartment.name}</span>
              <span className="text-muted-foreground text-xs">
                ({selectedDepartment.code})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search departments..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No department found."}
            </CommandEmpty>
            <CommandGroup>
              {data?.data.map((department) => (
                <CommandItem
                  key={department.id}
                  value={department.code}
                  onSelect={() => {
                    onSelect(department);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === department.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{department.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {department.code}
                      {department.faculty && ` • ${department.faculty.name}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
