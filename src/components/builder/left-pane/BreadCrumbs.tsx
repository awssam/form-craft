import { SlashIcon } from "@radix-ui/react-icons";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

type Link = {
  href: string;
  label: string;
};

interface LeftPaneBreadCrumbsProps {
  links: Link[];
}

const LeftPaneBreadCrumbs = ({ links }: LeftPaneBreadCrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-1">
        {links?.map((link, idx: number) => (
          <Fragment key={link.href}>
            <BreadcrumbItem key={link.href}>
              {idx === links?.length - 1 ? (
                <BreadcrumbPage>{link.label}</BreadcrumbPage>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </BreadcrumbItem>
            {idx !== links?.length - 1 && (
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default LeftPaneBreadCrumbs;
