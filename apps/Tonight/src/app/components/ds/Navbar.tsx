import { useState, type ReactNode } from "react";
import { Menu, X, Search, Bell, User } from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface NavbarProps {
  brand?: ReactNode;
  items?: NavItem[];
  rightContent?: ReactNode;
  variant?: "default" | "transparent" | "colored";
  sticky?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  avatar?: { src?: string; name?: string; onClick?: () => void };
  className?: string;
}

export function Navbar({
  brand,
  items = [],
  rightContent,
  variant = "default",
  sticky = true,
  showSearch = false,
  onSearch,
  avatar,
  className = "",
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const variantClasses = {
    default: "bg-background border-b border-border",
    transparent: "bg-transparent",
    colored: "bg-primary text-primary-foreground",
  };

  return (
    <nav className={`${sticky ? "sticky top-0 z-30" : ""} ${variantClasses[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            {brand && <div className="shrink-0">{brand}</div>}

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`
                    px-3 py-1.5 rounded-lg text-[0.8125rem] transition-colors cursor-pointer flex items-center gap-1.5
                    ${item.active
                      ? variant === "colored" ? "bg-white/20" : "bg-secondary text-foreground"
                      : variant === "colored" ? "hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {showSearch && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  variant === "colored" ? "hover:bg-white/10" : "hover:bg-secondary"
                }`}
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {rightContent}

            {avatar && (
              <button
                onClick={avatar.onClick}
                className="w-8 h-8 rounded-full bg-muted overflow-hidden cursor-pointer"
              >
                {avatar.src ? (
                  <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </button>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg cursor-pointer ${
                variant === "colored" ? "hover:bg-white/10" : "hover:bg-secondary"
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="py-2 border-t border-border">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); onSearch?.(e.target.value); }}
              placeholder="Search..."
              className="w-full px-4 py-2 bg-secondary rounded-lg text-[0.8125rem] outline-none"
              autoFocus
            />
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-2 border-t border-border space-y-1">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick?.(); setMobileOpen(false); }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] transition-colors cursor-pointer text-left
                  ${item.active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary"}
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
