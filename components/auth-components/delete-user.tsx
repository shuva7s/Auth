"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Error from "../shared/Error";

export const passWordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
});

const DeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof passWordSchema>>({
    resolver: zodResolver(passWordSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof passWordSchema>) {
    setLoading(true);
    await authClient.deleteUser(
      { password: values.password },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
          toast.success("Your account has been deleted successfully.", {
            closeButton: true,
            richColors: true,
          });
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          toast.error(ctx.error.message || "Failed to delete account", {
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
        <Button
          variant={"secondary"}
          disabled={loading}
          className="text-muted-foreground hover:text-foreground"
        >
          {loading ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            "Delete account"
          )}
          <span className="sr-only">Delete account</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            Please confirm your password to delete account.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && <Error error={error} />}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          disabled={loading}
                          {...field}
                          type={showPass ? "text" : "password"}
                          onChange={(e) => {
                            field.onChange(e);
                            setError("");
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 w-8 absolute top-1 right-1"
                          variant="secondary"
                          onClick={() => setShowPass((prev) => !prev)}
                        >
                          {showPass ? <EyeClosed /> : <Eye />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 md:flex md:flex-row md:justify-end mt-6">
                <DialogClose asChild>
                  <Button
                    type="submit"
                    disabled={loading}
                    variant={"secondary"}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin text-muted-foreground" />
                    ) : (
                      "Delete account"
                    )}
                    <span className="sr-only">Delete account</span>
                  </Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button type="button">Cancel</Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUser;
