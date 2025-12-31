"use client";

import { SidebarTrigger } from "@/shared/ui/sidebar";
import { Separator } from "@/shared/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { useBreadcrumbs } from "../hooks";

export function NavbarBreadcrumb() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">ThinkTogether</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.length > 0 && (
            <BreadcrumbSeparator className="hidden md:block" />
          )}
          {breadcrumbs.map((item) => (
            <BreadcrumbItem key={item.href}>
              {item.isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href} className="hidden md:block">
                  {item.title}
                </BreadcrumbLink>
              )}
              {!item.isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

