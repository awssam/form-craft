import React from "react";

import LeftPaneBreadCrumbs from "./BreadCrumbs";
import { Input } from "@/components/ui/input";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/builder", label: "Builder" },
];

const Header = () => {
  return (
    <header className="flex flex-col gap-2">
      <LeftPaneBreadCrumbs links={links} />
      <div className="flex justify-between items-center gap-2">
        <Input
          defaultValue={"Untitled Form"}
          className="border-0 p-0 border-b-[1px] border-b-greyBorder rounded-none focus-visible:ring-0 font-bold text-muted-foreground text-xl"
        />
      </div>
    </header>
  );
};

export default Header;
