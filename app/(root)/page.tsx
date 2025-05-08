import SignInButton from "@/components/auth-components/sign-in-button";
import SignOutButton from "@/components/auth-components/sign-out-button";
import LinkButton from "@/components/shared/LinkButton";
// import { ModeToggle } from "@/components/shared/ModeToggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={50}
        height={50}
        className="size-12 dark:invert"
        priority
      />
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:test-6xl font-bold text-center">
        Welcome to Auth
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-xl">
        This is a fullstack authentication app. Sign-in sign-up with email,
        google or github, forgot password, session mangagement, revoke sessions,
        update account, delete account and more.
      </p>
      {session ? (
        <div className="flex gap-2 flex-wrap mt-2">
          <SignOutButton afterSignOut="/" />
          <LinkButton href="/dashboard" text="Dashboard" />
        </div>
      ) : (
        <SignInButton path="/sign-in" className="mt-2" />
      )}
    </>
  );
};

export default Page;
