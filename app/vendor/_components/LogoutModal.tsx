"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LogoutModal() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // NextAuth sign out
      await signOut({ redirect: false }); 
      router.push("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 cursor-pointer">
          <LogOut className="h-5 w-5 text-red-600" />
          <span className="font-normal text-base leading-none">Log Out</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? You will need to log in again to
            access your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}