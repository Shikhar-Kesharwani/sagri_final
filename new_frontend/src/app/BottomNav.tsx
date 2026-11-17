import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, LayoutDashboard, ScanLine, TrendingUp, Users } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Story", icon: Sparkles },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/disease-detection", label: "Disease AI", icon: ScanLine },
  { to: "/market-price", label: "Mandi Rates", icon: TrendingUp },
  { to: "/community", label: "Community", icon: Users },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-2 py-2 print:hidden shadow-2xl"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
          const Icon = item.icon;

          return (
            <button
              key={item.to}
              type="button"
              onClick={() => navigate(item.to)}
              className="relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] text-center"
            >
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-wheat/20 text-wheat shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-wheat font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
