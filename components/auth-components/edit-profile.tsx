"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { CircleAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Error from "../shared/Error";

export const passWordSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
});

const EditProfile = ({ name }: { name: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [currentName, setCurrentName] = useState(name);

  const form = useForm<z.infer<typeof passWordSchema>>({
    resolver: zodResolver(passWordSchema),
    defaultValues: {
      name: currentName,
    },
  });

  async function onSubmit(values: z.infer<typeof passWordSchema>) {
    if (values.name === currentName) {
      form.setError("name", {
        message: "New name can not be same as old name",
      });
      return;
    }
    setLoading(true);
    await authClient.updateUser(
      { name: values.name },
      {
        onSuccess: () => {
          setCurrentName(values.name);
          form.reset({ name: values.name });
          router.refresh();
          toast.success("Your account has been updated successfully.", {
            closeButton: true,
            richColors: true,
          });
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          toast.error(ctx.error.message || "Failed to update account", {
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
        <Button variant={"secondary"} disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            "Edit profile"
          )}
          <span className="sr-only">Edit profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Edit your profile informaion and save changes.
          </DialogDescription>
          <div className="text-sm px-3 py-2.5 flex gap-2 items-center text-left bg-accent dark:bg-card rounded-md text-muted-foreground mt-4">
            <CircleAlert className="size-4 shrink-0" />
            Only name can be changed for now.
          </div>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && <Error error={error} />}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter new name"
                        disabled={loading}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setError("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 md:flex md:flex-row md:justify-end mt-6">
                <Button
                  type="submit"
                  disabled={loading || !form.formState.isDirty}
                  variant={"secondary"}
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-muted-foreground" />
                  ) : (
                    "Save changes"
                  )}
                  <span className="sr-only">Save changes</span>
                </Button>

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

export default EditProfile;
