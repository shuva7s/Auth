"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import LoadingButton from "../shared/LoadingButton";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Error from "../shared/Error";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import OAuthButton from "./oauthButton";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name is required").max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
});

const SignUp = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setDisabled(true);
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL!}/api/sign-up`,
        values,
        {
          withCredentials: true,
        }
      );
      router.refresh();
      toast.success("OTP sent to your email", {
        closeButton: true,
        richColors: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  }
  async function handleOauthSignIn(provider: "google" | "github") {
    setDisabled(true);
    if (provider === "google") {
      setGoogleLoading(true);
    } else {
      setGithubLoading(true);
    }
    await authClient.signIn.social(
      {
        provider: provider,
        // provider: "github",
      },
      {
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
    if (provider === "google") {
      setGoogleLoading(false);
    } else {
      setGithubLoading(false);
    }
    setDisabled(false);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Sign up to Auth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <OAuthButton
            src="/google.svg"
            alt="Google"
            variant="secondary"
            loading={googleLoading}
            disabled={disabled}
            onClick={() => handleOauthSignIn("google")}
          />
          <OAuthButton
            src="/github.svg"
            alt="Github"
            variant="secondary"
            imageClassName="dark:invert"
            loading={githubLoading}
            disabled={disabled}
            onClick={() => handleOauthSignIn("github")}
          />
        </div>
        <div className="relative my-8">
          <hr className="rounded-full" />
          <span className="text-xs text-muted-foreground bg-card absolute inline-block px-3 py-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full">
            Or
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      {...field}
                      disabled={disabled}
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="john@email.com"
                      {...field}
                      disabled={disabled}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter password"
                        disabled={disabled}
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

            {error && <Error error={error} />}

            <LoadingButton
              type="submit"
              text="Sign up"
              disabled={!!error || disabled}
              loading={form.formState.isSubmitting || loading}
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="md:justify-center">
        <Button
          variant={"link"}
          size={"sm"}
          disabled={disabled}
          className="p-0"
        >
          <Link
            href="/sign-in"
            className="w-full h-full flex items-center justify-center p-2 rounded-md text-sm"
          >
            Already have an account?
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
