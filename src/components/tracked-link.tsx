"use client";

import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { trackCtaClick } from "@/lib/analytics";

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
    trackingLabel: string;
    trackingLocation: string;
  };

export function TrackedLink({ trackingLabel, trackingLocation, onClick, children, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackCtaClick(trackingLabel, trackingLocation);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}

