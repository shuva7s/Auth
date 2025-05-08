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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/AuthCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Error from "../shared/Error";
import LoadingButton from "../shared/LoadingButton";
import { Button } from "../ui/button";
import { Eye, EyeClosed } from "lucide-react";

export const resetPassSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
    confirm_new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });

const Reset = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof resetPassSchema>>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
    },
  });

  const searchParams = useSearchParams();
  const err = searchParams.get("error");
  const token = searchParams.get("token");

  if (err === "INVALID_TOKEN") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          <Error error="Invalid or expired token" />
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          <Error error="Missing token" />
        </CardContent>
      </Card>
    );
  }

  async function onSubmit(values: z.infer<typeof resetPassSchema>) {
    if (!token) {
      setError("Missing token");
      return;
    }
    await authClient.resetPassword(
      {
        newPassword: values.new_password,
        token: token,
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          toast.success("Password reset successful. Login to continue.", {
            closeButton: true,
            richColors: true,
          });
          router.push("/sign-in");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Reset password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="New password"
                        disabled={form.formState.isSubmitting || loading}
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
            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm new password"
                        disabled={form.formState.isSubmitting || loading}
                        {...field}
                        type={showConfirmPass ? "text" : "password"}
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
                        onClick={() => setShowConfirmPass((prev) => !prev)}
                      >
                        {showPass ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <Error error={error} />}

            <LoadingButton
              type="submit"
              text="Continue"
              disabled={!!error}
              loading={form.formState.isSubmitting || loading}
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Reset;
