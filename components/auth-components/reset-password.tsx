"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

const ResetPassword = ({ email }: { email: string }) => {
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email) {
      toast.error("Invalid email", {
        closeButton: true,
        richColors: true,
      });
      return;
    }
    setLoading(true);
    await authClient.forgetPassword(
      { email: email, redirectTo: "/reset-password" },
      {
        onSuccess: () => {
          toast.success("Password reset link sent to your email", {
            closeButton: true,
            richColors: true,
          });
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Something went wrong", {
            closeButton: true,
            richColors: true,
          });
        },
      }
    );
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Reset password"}
          <span className="sr-only">Reset password</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will send you a password reset links.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleReset}
            disabled={loading}
            variant={"secondary"}
          >
            {loading ? (
              <Loader2 className="animate-spin text-muted-foreground" />
            ) : (
              "Send reset link"
            )}
            <span className="sr-only">Reset password</span>
          </Button>

          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
