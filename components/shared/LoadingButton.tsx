import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const LoadingButton = ({
  text,
  loading = false,
  disabled = false,
  variant = "default",
  size = "default",
  type = "button",
  className,
}: {
  text: string;
  loading: boolean;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "submit" | "reset" | "button";
  className?: string;
}) => {
  return (
    <Button
      className={cn(
        className,
        "overflow-y-hidden p-0"
        // loading && "disabled:cursor-progress"
      )}
      type={type}
      variant={variant}
      size={size}
      disabled={loading || disabled}
    >
      <span
        className={`flex flex-col h-full transition-transform ${
          loading && "-translate-y-full"
        }`}
      >
        <span className="flex justify-center items-center h-full shrink-0">
          {text}
        </span>
        <span className="flex justify-center items-center h-full shrink-0">
          <Loader2 className="animate-spin scale-125" />
        </span>
      </span>
    </Button>
  );
};

export default LoadingButton;
