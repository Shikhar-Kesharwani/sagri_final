import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Search, Sparkles, User, X } from "lucide-react";
import { PlainLink, TextNavLink } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { ActionLink, NavAnchor, Text } from "@/components/ui/primitives";
import { NAV_GROUPS, PROFILE_NAV } from "@/src/data/nav";
import { CommandPalette } from "./CommandPalette";
import { VoiceAssistant } from "./VoiceAssistant";
import { LanguageSelector } from "./LanguageSelector";
import { BottomNav } from "./BottomNav";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageContext";

const TOP_NAV = [
  { key: "nav.dashboard", fallback: "Dashboard", to: "/dashboard" },
  { key: "nav.market", fallback: "Mandi Market Rates", to: "/market-price" },
  { key: "nav.schemes", fallback: "Government Schemes", to: "/schemes" },
];

/** Full-screen editorial index of every tool, in the style of the home page's Tools list. */
function ToolsIndex({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  let n = 0;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-paper text-ink"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-3 lg:px-10 lg:py-24">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <Text size="sm" tone="inkMuted">
              {group.label}
            </Text>
            <ul className="mt-6 border-t border-line">
              {group.items.map((item) => {
                n += 1;
                return (
                  <li key={item.to} className="border-b border-line">
                    <PlainLink to={item.to} onClick={onClose} className="group relative overflow-hidden">
                      <span className="absolute inset-0 origin-left scale-x-0 bg-ink/5 transition-transform duration-500 group-hover:scale-x-100" />
                      <span className="relative flex items-center gap-4 py-5">
                        <Text as="span" size="xs" tone="inkMuted" mono className="w-6">
                          {String(n).padStart(2, "0")}
                        </Text>
                        <span className="flex-1 transition-transform duration-500 group-hover:translate-x-2">
                          <Text as="span" size="none" tone="ink" className="block font-serif text-2xl">
                            {item.label}
                          </Text>
                          <Text as="span" size="xs" tone="inkMuted" className="block">
                            {item.blurb}
                          </Text>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </PlainLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, openModal } = useAuth();
  const { t } = useLanguage();

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground selection:bg-wheat/30">
      {/* Same header as the home page: wordmark, four links, profile button. */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6 lg:px-10">
          <PlainLink to="/" aria-label="Sagri home" title="Sagri · Home & Season Story">
            <Text as="span" className="font-serif text-2xl text-foreground hover:opacity-80 transition-opacity">
              Sagri
            </Text>
          </PlainLink>
          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            <ActionLink
              tone={menuOpen ? "default" : "muted"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="text-sm hover:no-underline hover:text-foreground"
            >
              {t("nav.tools") || "Tools"}
            </ActionLink>
            {TOP_NAV.map((item) => (
              <TextNavLink
                key={item.to}
                to={item.to}
                tone={location.pathname === item.to ? "default" : "muted"}
                aria-current={location.pathname === item.to ? "page" : undefined}
              >
                {t(item.key) || item.fallback}
              </TextNavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Search 22 crops, leaf diseases, mandi rates, govt schemes (Ctrl K)"
              title="Search 22 crops, leaf diseases, mandi rates, govt schemes… ⌘K"
              onClick={() => setPaletteOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {user?.role === "admin" && (
              <PlainLink
                to="/admin"
                className="hidden h-9 items-center rounded-full border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 md:inline-flex"
              >
                🛡️ Admin
              </PlainLink>
            )}

            {user ? (
              <button
                type="button"
                onClick={openModal}
                className="hidden h-9 items-center gap-2 rounded-full border border-wheat/30 bg-wheat/10 px-3 text-xs font-medium text-foreground transition-all hover:bg-wheat/20 md:inline-flex"
                title="Account & Rewards"
              >
                <span className="font-serif text-sm font-semibold text-wheat">{user.name.split(" ")[0]}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-wheat/20 px-2 py-0.5 text-[10px] font-bold text-wheat">
                  <Sparkles className="h-2.5 w-2.5" />
                  {user.points} pts
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openModal}
                className="hidden h-9 items-center rounded-full bg-wheat px-3.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-wheat/90 md:inline-flex"
              >
                Login
              </button>
            )}

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Classic SAGRI Platform (Port 5173)"
              className="hidden h-9 items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20 lg:inline-flex"
            >
              🌿 Classic 5173 ↗
            </a>

            <PlainLink
              to={PROFILE_NAV.to}
              className="hidden h-9 items-center rounded-full border border-input bg-background px-3 text-xs font-medium transition-colors hover:bg-accent lg:inline-flex"
            >
              Farm Profile
            </PlainLink>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>{menuOpen && <ToolsIndex onClose={() => setMenuOpen(false)} />}</AnimatePresence>

      <main className="mx-auto max-w-7xl px-6 pb-28 pt-16 lg:px-10 lg:pb-36">
        <Outlet />
      </main>

      <footer className="border-t border-border print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Text as="span" className="font-serif text-xl">
            Sagri
          </Text>
          <Text size="xs" tone="muted">
            Built with farmers, for every season. © {new Date().getFullYear()}
          </Text>
        </div>
      </footer>

      <VoiceAssistant />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <BottomNav />
      <ScrollRestoration />
    </div>
  );
}
