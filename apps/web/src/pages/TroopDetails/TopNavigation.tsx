import {
  Boxes,
  FileCog,
  GraduationCap,
  Handshake,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TopNavigationProps = {
  troopId?: string;
};

const navigationItems = [
  { label: "Członkowie", path: "members", icon: Users },
  {
    label: "Stopnie i sprawności",
    path: "ranks-and-skills",
    icon: GraduationCap,
  },
  { label: "Templatki stopni", path: "templates", icon: FileCog },
  { label: "Magazyn", path: "warehouse", icon: Boxes },
  { label: "Kontakt", path: "contact", icon: Handshake },
  // { label: "Statystyki", path: "statistics", icon: BarChart3 },
  // { label: "Plan pracy", path: "work-plan", icon: ClipboardList },
];

export function TopNavigation({ troopId }: TopNavigationProps) {
  if (!troopId) return null;

  return (
    <nav
      aria-label="Nawigacja drużyny"
      className="w-full overflow-x-auto rounded-xl border border-border/70 bg-card/80 p-1.5 shadow-sm backdrop-blur-sm"
    >
      <div className="flex min-w-max gap-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={`/troop/${troopId}/${item.path}`}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-9 gap-2 rounded-lg px-3 text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                isActive &&
                  "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground",
              )
            }
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
