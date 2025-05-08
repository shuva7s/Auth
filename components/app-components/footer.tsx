import Image from "next/image";

const Footer = () => {
  return (
    <footer className="wrapper border-t pt-6 pb-10 flex flex-col gap-4 items-center text-center bg-accent dark:bg-accent/50">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={25}
          height={25}
          className="size-6 dark:invert"
          priority
        />
        <p className="font-semibold">Auth</p>
      </div>
      <p className="text-muted-foreground text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis vitae
        libero beatae a! Minus blanditiis itaque natus.
      </p>
    </footer>
  );
};

export default Footer;
