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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const LinkSocialAccount = ({ provider }: { provider: string }) => {
  const trustedProviders = ["google", "github"];
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleRevokeSession = async () => {
    setLoading(true);
    try {
      if (!provider || !trustedProviders.includes(provider)) {
        throw new Error("Invalid provider");
      }
      await authClient.linkSocial({
        provider: provider as "google" | "github",
      });
      router.refresh();
      toast.success("Revoked session successfully", {
        richColors: true,
        closeButton: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", {
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
            "Link"
          )}
          <span className="sr-only">Link social account</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will link your account with {provider}
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
                `Link ${provider}`
              )}
              <span className="sr-only">Link social account</span>
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

export default LinkSocialAccount;
