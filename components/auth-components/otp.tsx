"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/AuthCard";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LoadingButton from "../shared/LoadingButton";
import Error from "../shared/Error";

const OtpFormSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const Otp = ({ signup_token }: { signup_token: string }) => {
  const form = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [cooldownError, setCooldownError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [remResendTime, setRemResendTime] = useState(0);

  let interval: NodeJS.Timeout | null = null;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCooldownTime = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL!}/get-cooldown-time`,
          { token: signup_token },
          { withCredentials: true }
        );

        const remaining = response.data.remResendTime;
        setRemResendTime(remaining);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        if (remaining > 0) {
          intervalRef.current = setInterval(() => {
            setRemResendTime((prev) => {
              if (prev <= 1) {
                clearInterval(intervalRef.current!);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err instanceof AxiosError && err.response?.status === 429) {
          setCooldownError(
            err.response.data.message || "Too many requests for cooldown time"
          );
        }
      }
    };

    if (signup_token) {
      fetchCooldownTime();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [signup_token]);

  const onSubmit = async (values: z.infer<typeof OtpFormSchema>) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/verify-signup-otp`,
        { otp: values.otp },
        { withCredentials: true }
      );
      router.push("/sign-in");
      toast.success("Sign-up successful, login to continue", {
        closeButton: true,
        richColors: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/resend-sign-up-otp`,
        { token: signup_token },
        { withCredentials: true }
      );
      setRemResendTime(response.data.remResendTime);

      form.reset();

      toast.success("New activation otp has been sent", {
        closeButton: true,
        richColors: true,
      });

      if (response.data.remResendTime > 0) {
        if (interval) {
          clearInterval(interval);
        }
        interval = setInterval(() => {
          setRemResendTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval!);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.log("Error resending OTP:", error);
      if (error instanceof AxiosError && error.response?.status === 429) {
        setError(error.response.data.message || "Too many resend OTP requests");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-8">
        <CardTitle className="text-center">Activate account</CardTitle>
        <CardDescription className="text-center">
          Verify account activation OTP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="mb-0">One time password</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 w-8"
                      onClick={() => setShowOtp((prev) => !prev)}
                    >
                      {showOtp ? (
                        <EyeClosed className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setError("");
                      }}
                      className="w-full"
                      disabled={form.formState.isSubmitting || loading}
                    >
                      <InputOTPGroup className="w-full flex">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            className="flex-1"
                            index={index}
                            showOtp={showOtp}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <Error error={error} />}

            <LoadingButton
              type="submit"
              text="Verify"
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                !!error
              }
              loading={loading}
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        {cooldownError ? (
          <p className="text-xs text-muted-foreground">{cooldownError}</p>
        ) : (
          <div className="w-full flex-wrap flex items-center justify-center gap-2">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the OTP?
            </p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs px-2.5"
              disabled={
                remResendTime > 0 ||
                form.formState.isSubmitting ||
                loading ||
                resendLoading
              }
              onClick={resendOtp}
            >
              {resendLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>{remResendTime > 0 ? `${remResendTime}s` : "Resend"}</>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Otp;
