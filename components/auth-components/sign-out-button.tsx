"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

const SignOutButton = ({ afterSignOut }: { afterSignOut: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      router.push(afterSignOut);
      router.refresh();
      toast.success("Signed out successfully", {
        richColors: true,
        closeButton: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out.", {
        richColors: true,
        closeButton: true,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin size-4 text-muted-foreground" />
          ) : (
            "Sign out"
          )}
          <span className="sr-only">Sign out button</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will log you out of your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin size-4 text-muted-foreground" />
              ) : (
                "Sign out"
              )}
              <span className="sr-only">Sign out button</span>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutButton;
