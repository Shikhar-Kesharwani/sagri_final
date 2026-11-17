import * as React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

export type Tone = "default" | "muted" | "ink" | "inkMuted" | "accent" | "inherit";

const tones: Record<Tone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  ink: "text-ink",
  inkMuted: "text-ink-muted",
  accent: "text-wheat",
  inherit: "",
};

type HeadingSize = "display" | "title" | "subtitle" | "small";

const headingSizes: Record<HeadingSize, string> = {
  display: "text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight",
  title: "text-4xl sm:text-5xl leading-tight tracking-tight",
  subtitle: "text-2xl sm:text-3xl leading-snug tracking-tight",
  small: "text-base leading-snug",
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: HeadingSize;
  family?: "serif" | "sans";
  tone?: Tone;
}

export function Heading({
  as: Tag = "h2",
  size = "title",
  family = "sans",
  tone = "default",
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        headingSizes[size],
        family === "serif" ? "font-serif font-normal" : "font-sans font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** "none" leaves sizing to className (for display numbers and titles). */
type TextSize = "lg" | "base" | "sm" | "xs" | "none";

const textSizes: Record<TextSize, string> = {
  lg: "text-lg leading-relaxed",
  base: "text-base leading-relaxed",
  sm: "text-sm leading-relaxed",
  xs: "text-xs leading-normal",
  none: "",
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div";
  size?: TextSize;
  tone?: Tone;
  mono?: boolean;
}

export function Text({
  as: Tag = "p",
  size = "base",
  tone = "default",
  mono = false,
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        textSizes[size],
        tones[tone],
        mono && "font-mono tabular-nums tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export interface ActionLinkProps extends HTMLMotionProps<"button"> {
  tone?: Tone;
}

/** Text-style action used for quiet, inline navigation. */
export const ActionLink = React.forwardRef<HTMLButtonElement, ActionLinkProps>(
  ({ className, tone = "accent", type = "button", ...props }, ref) => (
    <motion.button
      ref={ref}
      type={type}
      className={cn(
        "group inline-flex items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tones[tone],
        className,
      )}
      {...props}
    />
  ),
);
ActionLink.displayName = "ActionLink";

/** Unstyled full-width row action for list layouts. */
export const RowButton = React.forwardRef<HTMLButtonElement, HTMLMotionProps<"button">>(
  ({ className, type = "button", ...props }, ref) => (
    <motion.button
      ref={ref}
      type={type}
      className={cn(
        "group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  ),
);
RowButton.displayName = "RowButton";

export interface NavAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: Tone;
}

export function NavAnchor({ className, tone = "muted", ...props }: NavAnchorProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2 rounded-sm text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
