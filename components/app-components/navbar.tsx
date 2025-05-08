import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import SignInButton from "../auth-components/sign-in-button";
import { ModeToggle } from "../shared/ModeToggle";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <header className="flex items-center justify-between gap-4 wrapper border-b h-18 md:h-20">
      <div className="flex items-center gap-2 h-full md:pr-5 md:border-r">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={25}
          height={25}
          className="size-8 dark:invert"
          priority
        />
        <p className="text-lg font-semibold">Auth</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 h-full md:pl-5 md:border-l">
        {session ? (
          <>
            <div className="text-right hidden md:block">
              <p className="font-semibold">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {session.user?.email}
              </p>
            </div>

            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={42}
                height={42}
                className="size-10 rounded-full"
                priority
              />
            ) : (
              <div
                className={`text-lg leading-none font-semibold size-10 md:size-10 bg-border dark:bg-accent rounded-full flex justify-center items-center`}
              >
                {session.user.name[0].toUpperCase()}
              </div>
            )}
          </>
        ) : (
          <>
            <ModeToggle />
            <SignInButton />
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
