"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const OAuthButton = ({
  src,
  alt,
  loading = false,
  disabled = false,
  variant = "default",
  size = "default",
  type = "button",
  className,
  imageClassName,
  onClick,
}: {
  src: string;
  alt: string;
  loading: boolean;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "submit" | "reset" | "button";
  className?: string;
  imageClassName?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Button
      className={cn(className, "overflow-y-hidden p-0")}
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={loading || disabled}
    >
      <span
        className={`flex flex-col h-full transition-transform ${
          loading && "-translate-y-full"
        }`}
      >
        <span className="flex justify-center items-center h-full shrink-0">
          <Image
            src={src}
            alt={alt}
            width={24}
            height={24}
            className={cn(imageClassName, "select-none")}
            priority
            draggable={false}
          />
        </span>
        <span className="flex justify-center items-center h-full shrink-0">
          <Loader2 className="animate-spin scale-125" />
        </span>
      </span>
    </Button>
  );
};

export default OAuthButton;
