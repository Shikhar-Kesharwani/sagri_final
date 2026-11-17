import * as React from "react";
import { Link, NavLink } from "react-router";
import type { LinkProps, NavLinkProps } from "react-router";
import { cn } from "@/lib/cn";

type LinkTone = "accent" | "default" | "muted" | "ink";

const toneClass: Record<LinkTone, string> = {
  accent: "text-wheat",
  default: "text-foreground",
  muted: "text-muted-foreground hover:text-foreground",
  ink: "text-ink",
};

const focus = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Inline text link inside the app (client-side navigation). */
export function AppLink({ className, tone = "accent", ...props }: LinkProps & { tone?: LinkTone }) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium underline-offset-4 transition-colors hover:underline",
        focus,
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Unstyled client-side link wrapper for composite blocks. */
export function PlainLink({ className, ...props }: LinkProps) {
  return <Link className={cn("block", focus, className)} {...props} />;
}

const buttonBase =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const buttonVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-border text-foreground hover:bg-secondary",
};

/** Link that looks like a button. */
export function LinkButton({
  className,
  variant = "outline",
  ...props
}: LinkProps & { variant?: keyof typeof buttonVariants }) {
  return <Link className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

/** External link that looks like a button. */
export function ExternalButton({
  className,
  variant = "outline",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: keyof typeof buttonVariants }) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      className={cn(buttonBase, buttonVariants[variant], className)}
      {...props}
    />
  );
}

/** Sidebar navigation item with active state. */
export function SideLink({ className, children, ...props }: NavLinkProps & { className?: string }) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          focus,
          isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
          className,
        )
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}

/** Client-side link styled like the home page's NavAnchor (quiet header text link). */
export function TextNavLink({
  className,
  tone = "muted",
  ...props
}: LinkProps & { tone?: "muted" | "default" }) {
  return (
    <Link
      className={cn(
        "inline-flex items-center gap-2 rounded-sm text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tone === "muted" ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}
