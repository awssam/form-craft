"use client";

import React  from "react";

import LeftPaneBreadCrumbs from "./BreadCrumbs";
import { Input } from "@/components/ui/input";

import { useFormActionProperty, useFormProperty } from "@/zustand/store";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/builder", label: "Builder" },
];

const Header = () => {
  return (
    <header className="flex flex-col gap-2">
      <LeftPaneBreadCrumbs links={links} />
      <div className="flex justify-between items-center gap-2">
        <FormName />
      </div>
    </header>
  );
};

const FormName = () => {
  const name = useFormProperty("name")!;
  const updateFormConfig = useFormActionProperty("updateFormConfig");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormConfig({ name: e.target.value });
  };

  return (
    <Input
      onChange={handleNameChange}
      value={name}
      className="border-0 p-0 border-b-[1px] border-b-greyBorder rounded-none focus-visible:ring-0 font-bold text-muted-foreground text-xl"
    />
  );
};

export default Header;
