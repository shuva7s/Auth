import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const SignInButton = ({
  path,
  className,
}: {
  path?: string;
  className?: string;
}) => {
  return (
    <Button asChild size="sm" className={cn(className)}>
      <Link href={path || "/sign-in"}>Sign In</Link>
    </Button>
  );
};

export default SignInButton;
