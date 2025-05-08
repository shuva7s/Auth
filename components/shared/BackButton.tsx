"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button className="w-full" onClick={() => router.back()}>
      Go back
    </Button>
  );
};

export default BackButton;
