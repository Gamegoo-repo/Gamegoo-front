"use client";

import { redirect, usePathname } from "next/navigation";

export default function NotFoundCatchAll() {
  const pathname = usePathname();

  if (pathname !== "/not-found") {
    redirect("/not-found");
  }
  return null;
}
