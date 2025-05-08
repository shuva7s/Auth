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
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const RevokeSession = ({
  token,
  device,
  loading,
  setLoading,
}: {
  token: string;
  device: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const handleRevokeSession = async () => {
    if (!token) {
      toast.error("Missing token.", {
        richColors: true,
        closeButton: true,
      });
      return;
    }
    setLoading(true);
    try {
      await authClient.revokeSession({
        token,
      });
      router.refresh();
      toast.success("Revoked session successfully", {
        richColors: true,
        closeButton: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke session.", {
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
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-1/2 right-3 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
        >
          {loading ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            <LogOut />
          )}
          <span className="sr-only">Revoke session</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will log you out from <b>{device}</b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={handleRevokeSession}
              disabled={loading}
              variant={"secondary"}
            >
              {loading ? (
                <Loader2 className="animate-spin text-muted-foreground" />
              ) : (
                "Revoke session"
              )}
              <span className="sr-only">Revoke session</span>
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

export default RevokeSession;
