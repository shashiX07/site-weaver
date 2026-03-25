import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Sparkles, LayoutDashboard, Globe, LayoutTemplate, Compass, Settings, Upload, ShieldCheck, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Websites", url: "/my-websites", icon: Globe },
  { title: "Templates", url: "/dashboard/templates", icon: LayoutTemplate },
  { title: "Explore", url: "/marketplace", icon: Compass },
  { title: "Upload Template", url: "/freelancer", icon: Upload },
  { title: "Admin", url: "/admin", icon: ShieldCheck },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">TemplatePro</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">John Doe</p>
            <p className="truncate text-xs text-muted-foreground">john@example.com</p>
          </div>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
