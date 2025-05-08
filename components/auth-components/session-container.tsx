"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Badge } from "../ui/badge";
import RevokeSession from "./revoke-session";
import RevokeOtherSessions from "./revoke-other-sessions";
import { useState } from "react";

type formattedSessionType = {
  id: string;
  token: string;
  deviceType: string;
  os: string;
  browser: string;
};
const SessionContainer = ({
  currentSessioId,
  sessions,
}: {
  currentSessioId: string;
  sessions: formattedSessionType[];
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {sessions.map((ssn) => (
        <div
          key={ssn.id}
          className="flex gap-2.5 border items-center rounded-md overflow-hidden relative flex-wrap"
        >
          {ssn.id === currentSessioId ? (
            <Badge className="absolute top-3 right-3">Current</Badge>
          ) : (
            <RevokeSession
              token={ssn.token}
              device={ssn.deviceType + " " + ssn.browser}
              loading={loading}
              setLoading={setLoading}
            />
          )}

          <div className="flex items-center justify-center size-16 bg-border dark:bg-accent-md">
            {ssn.deviceType === "desktop" && <Monitor />}
            {ssn.deviceType === "mobile" && <Smartphone />}
          </div>
          <div>
            <p>{ssn.os}</p>
            <p className="text-sm text-muted-foreground">{ssn.browser}</p>
          </div>
        </div>
      ))}
      {sessions.length > 1 && (
        <RevokeOtherSessions loading={loading} setLoading={setLoading} />
      )}
    </>
  );
};

export default SessionContainer;
