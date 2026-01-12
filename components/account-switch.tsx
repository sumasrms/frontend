"use client";

import { ChevronDown, Loader2, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SessionData } from "@/data/user/session-query";
import { useSessionQuery } from "@/data/user/session-query";
import { useSignOutMutation } from "@/data/user/sign-out-mutation";

export default function AccountSwitcher({
  initialSession,
}: {
  initialSession: SessionData;
}) {
  const signOutMutation = useSignOutMutation();
  const { data: currentUser } = useSessionQuery(initialSession);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="User menu"
          className="w-[250px] justify-between"
        >
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage
              src={currentUser?.user.image || undefined}
              alt={currentUser?.user.name}
            />
            <AvatarFallback>{currentUser?.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {currentUser?.user.name}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem className="text-sm w-full">
                <div className="flex items-center">
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={currentUser?.user.image || undefined}
                      alt={currentUser?.user.name}
                    />
                    <AvatarFallback>
                      {currentUser?.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{currentUser?.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.user.email}
                    </p>
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push("/dashboard/settings");
                  setOpen(false);
                }}
                className="cursor-pointer text-sm"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  signOutMutation.mutate(undefined, {
                    onSuccess: () => {
                      router.push("/");
                    },
                  });
                }}
                disabled={signOutMutation.isPending}
                className="cursor-pointer text-sm text-destructive"
              >
                {signOutMutation.isPending ? (
                  <Loader2 size={15} className="mr-2 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Sign Out
			  </CommandItem>
			</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
