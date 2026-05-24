import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Search, Clock, Map } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/diagnose", icon: Search, label: "Diagnose" },
  { path: "/history", icon: Clock, label: "History" },
  { path: "/map", icon: Map, label: "Field Map" },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-lg">🌿</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-foreground">AgriSmart</h1>
            <p className="text-[10px] font-medium text-muted-foreground leading-tight">AI Assistant</p>
          </div>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation - mobile style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t">
        <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-colors relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-[11px] font-medium relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}