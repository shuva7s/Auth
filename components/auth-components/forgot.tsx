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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/AuthCard";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Error from "../shared/Error";
import LoadingButton from "../shared/LoadingButton";
import { toast } from "sonner";

export const forgotSchema = z.object({
  email: z.string().email(),
});
const Forgot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof forgotSchema>) {
    setLoading(true);
    await authClient.forgetPassword(
      { email: values.email, redirectTo: "/reset-password" },
      {
        onSuccess: () => {
          toast.success("Password reset link sent to your email", {
            closeButton: true,
            richColors: true,
          });
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
    setLoading(false);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Forgot Password?</CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a reset password link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting || loading}
                      placeholder="Email: john@email.com"
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

export default Forgot;
