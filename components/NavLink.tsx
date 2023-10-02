"use client";

import { isNavItem } from "@/lib/common";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function NavLink({
  slug,
  children,
}: {
  slug: string;
  children: any;
}) {
  const params = useParams();

  if (!params.season)
    return (
      <Link href={`/seasons${isNavItem(slug) ? `?source=${slug}` : ""}`}>
        {children}
      </Link>
    );

  return <Link href={`/seasons/${params.season}/${slug}`}>{children}</Link>;
}
