import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UAParser } from "ua-parser-js";
import Image from "next/image";
import SignOutButton from "./sign-out-button";
import SessionContainer from "./session-container";
import ResetPassword from "./reset-password";
import DeleteUser from "./delete-user";
import EditProfile from "./edit-profile";

const Profile = async () => {
  const hdrs = await headers();
  const [session, sessions, accounts] = await Promise.all([
    auth.api.getSession({ headers: hdrs }),
    auth.api.listSessions({ headers: hdrs }),
    auth.api.listUserAccounts({ headers: hdrs }),
  ]);
  console.log(session);
  if (!session || !sessions || !accounts) {
    return redirect("/sign-in");
  }
  const parsedSessions = sessions
    .filter((s) => s.userAgent)
    .map((s) => {
      const parser = new UAParser(s.userAgent || "");
      const device = parser.getDevice();
      const os = parser.getOS();
      const browser = parser.getBrowser();
      return {
        id: s.id,
        token: s.token,
        deviceType: device.type || "desktop",
        os: os.name || "Unknown OS",
        browser: browser.name || "Unknown Browser",
      };
    });

  return (
    <Card className="max-w-5xl pb-0 rounded-lg">
      <CardHeader className="flex flex-col gap-4 border-b">
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <div className="truncate">
            <CardTitle className="text-xl">{session.user?.name}</CardTitle>
            <CardDescription className="mt-0.5">
              {session.user?.email}
            </CardDescription>
          </div>
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={48}
              height={48}
              className="size-12 rounded-full"
            />
          ) : (
            <div
              className={`text-lg leading-none font-semibold size-12 bg-border dark:bg-accent rounded-full flex justify-center items-center shrink-0`}
            >
              {session.user.name[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex justify-between flex-wrap w-full">
          <div className="flex gap-2 flex-wrap">
            <EditProfile name={session.user.name} />
            <ResetPassword email={session.user.email} />
          </div>
          <SignOutButton afterSignOut="/sign-in" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="-mt-1">
          <p className="font-bold leading-none">Sessions</p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <SessionContainer
              currentSessioId={session.session.id}
              sessions={parsedSessions}
            />
          </div>
        </div>
        <div className="mt-6">
          <p className="font-bold leading-none">Accounts</p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex gap-2.5 border items-center rounded-md overflow-hidden relative"
              >
                <div className="flex items-center justify-center size-16 bg-border dark:bg-accent-md">
                  {account.provider === "google" && (
                    <Image
                      src={"/google.svg"}
                      width={30}
                      height={30}
                      alt="Google"
                      priority
                    />
                  )}
                  {account.provider === "github" && (
                    <Image
                      src={"/github.svg"}
                      width={30}
                      height={30}
                      alt="Google"
                      className="dark:invert"
                      priority
                    />
                  )}
                  {account.provider === "credential" && (
                    <Image
                      src={"/credential.svg"}
                      width={27}
                      height={27}
                      alt="Credential"
                      className="dark:invert"
                      priority
                    />
                  )}
                </div>
                <div>
                  <p>
                    {account.provider[0].toUpperCase()}
                    {account.provider.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="items-start flex-col py-6 border-t border-destructiv/10">
        <p className="font-bold mb-4 text-muted-foreground">Danger</p>
        <div className="flex justify-between w-full gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-destructive">
              Delete account
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Be careful, this action will delete your account
            </p>
          </div>
          <DeleteUser />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Profile;
