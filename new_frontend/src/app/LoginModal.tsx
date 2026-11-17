import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sprout, ShieldCheck, Phone, Mail, Sparkles, ArrowRight, Check } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/primitives";

export function LoginModal() {
  const { isModalOpen, closeModal, quickLoginAsFarmer, quickLoginAsAdmin, login, user, logout } = useAuth();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [inputVal, setInputVal] = useState("");
  const [passVal, setPassVal] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setStatus("Authenticating...");
    try {
      await login(inputVal, passVal);
      setStatus("Success!");
      setTimeout(() => {
        setStatus(null);
        closeModal();
      }, 500);
    } catch {
      setStatus("Authentication failed. Please check credentials.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-wheat/30 bg-card/95 p-6 md:p-8 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wheat/15 border border-wheat/30">
              <Sprout className="h-6 w-6 text-wheat" />
            </div>
            <div>
              <Heading as="h3" family="serif" size="title" className="text-xl">
                Sagri Krishi Sahayak
              </Heading>
              <Text size="xs" tone="muted">
                Farmer Identity & Agriculture Dashboard
              </Text>
            </div>
          </div>

          {user ? (
            <div className="mt-6 rounded-2xl border border-leaf/30 bg-leaf/10 p-4">
              <div className="flex items-center gap-2 text-leaf font-medium text-sm">
                <Check className="h-4 w-4" />
                <span>Currently Signed In</span>
              </div>
              <div className="mt-2 text-base font-serif text-foreground font-semibold">
                {user.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {user.role === "admin" ? "🛡️ System Administrator" : `🌾 ${user.landSize} · ${user.district}, ${user.state}`}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-wheat/20 px-3 py-1 text-xs font-semibold text-wheat">
                  <Sparkles className="h-3 w-3" />
                  <span>{user.points} Rewards Points</span>
                </div>
                <Button variant="outline" size="default" onClick={logout} className="rounded-full text-xs">
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {/* Quick 1-Click Evaluation Logins */}
              <div>
                <Text size="xs" tone="muted" className="mb-2 font-mono uppercase tracking-wider">
                  Quick 1-Click Demo Profiles
                </Text>
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={quickLoginAsFarmer}
                    className="flex w-full items-center justify-between rounded-2xl border border-wheat/30 bg-wheat/10 p-3.5 text-left transition-all hover:bg-wheat/20 hover:border-wheat/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-wheat/20 text-wheat">
                        🌾
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          Ramesh Kumar (किसान)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Punjab · 5.5 Acres · 250 Points
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-wheat" />
                  </button>

                  <button
                    type="button"
                    onClick={quickLoginAsAdmin}
                    className="flex w-full items-center justify-between rounded-2xl border border-border bg-secondary/50 p-3.5 text-left transition-all hover:bg-secondary hover:border-border/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                        🛡️
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          Dr. Monu Singh (Admin)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Platform Admin & Agronomist
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Manual Login Tabs */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setTab("phone")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      tab === "phone" ? "bg-wheat text-primary-foreground font-semibold" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    Phone OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("email")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      tab === "email" ? "bg-wheat text-primary-foreground font-semibold" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    Email / Password
                  </button>
                </div>

                <form onSubmit={handleManualLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      {tab === "phone" ? "10-Digit Mobile Number" : "Email Address"}
                    </label>
                    <div className="relative">
                      {tab === "phone" ? (
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      )}
                      <input
                        type={tab === "phone" ? "tel" : "email"}
                        required
                        placeholder={tab === "phone" ? "9876543210" : "farmer@sagri.com"}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-wheat"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      {tab === "phone" ? "SMS OTP (Simulation: 123456)" : "Password"}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••"
                      value={passVal}
                      onChange={(e) => setPassVal(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-wheat"
                    />
                  </div>

                  {status && (
                    <div className="text-xs text-wheat font-mono">
                      {status}
                    </div>
                  )}

                  <Button type="submit" className="w-full rounded-full bg-wheat text-primary-foreground hover:bg-wheat/90 text-sm font-semibold mt-2">
                    Verify & Log In
                  </Button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
