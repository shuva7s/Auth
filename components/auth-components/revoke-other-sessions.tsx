"use client";

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
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const RevokeOtherSessions = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const handleRevokeOtherSessions = async () => {
    setLoading(true);
    try {
      await authClient.revokeOtherSessions();
      router.refresh();
      toast.success("Revoked other sessions successfully", {
        richColors: true,
        closeButton: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke sessions.", {
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
        <Button variant="secondary" className="h-auto min-h-16">
          {loading ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            "Revoke all other sessions"
          )}
          <span className="sr-only">Revoke other sessions</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will log you out of all the devices except the current
            one.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={handleRevokeOtherSessions}
              disabled={loading}
              variant={"secondary"}
            >
              {loading ? (
                <Loader2 className="animate-spin text-muted-foreground" />
              ) : (
                "Revoke all other sessions"
              )}
              <span className="sr-only">Revoke other sessions</span>
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

export default RevokeOtherSessions;
