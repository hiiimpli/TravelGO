import { Home, Compass, Heart, User } from "lucide-react";

export type Screen = "home" | "explore" | "saved" | "profile";

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
}

const tabs: { id: Screen; icon: typeof Home; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "explore", icon: Compass, label: "Explore" },
  { id: "saved", icon: Heart, label: "Saved" },
  { id: "profile", icon: User, label: "Profile" },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="flex items-center justify-around px-4 py-3 bg-white border-t border-border">
      {tabs.map(({ id, icon: Icon, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-1 min-w-[56px] transition-all"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
              style={isActive ? { background: "var(--primary)", transform: "translateY(-4px)" } : {}}
            >
              <Icon
                size={20}
                className={isActive ? "text-white" : "text-muted-foreground"}
              />
            </div>
            <span
              className="text-xs font-semibold transition-colors"
              style={isActive ? { color: "var(--primary)" } : { color: "var(--muted-foreground)" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
