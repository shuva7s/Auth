import Link from "next/link";
import { Button } from "../ui/button";

const LinkButton = ({ href, text }: { href: string; text: string }) => {
  return (
    <Button>
      <Link href={href || "/"}>{text || "Link button"}</Link>
    </Button>
  );
};

export default LinkButton;
