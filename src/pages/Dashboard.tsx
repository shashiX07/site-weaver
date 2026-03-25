import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Compass, Globe, LayoutTemplate, TrendingUp, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardStats, getUserWebsites, timeAgo } from "@/lib/store";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const stats = getDashboardStats(user.id);
  const websites = getUserWebsites(user.id);
  const recentProjects = websites.slice(-5).reverse();

  const statCards = [
    { label: "Websites", value: stats.websiteCount.toString(), icon: Globe, change: `${stats.publishedCount} published` },
    { label: "Templates Used", value: stats.templatesUsed.toString(), icon: LayoutTemplate, change: `${stats.draftCount} drafts` },
    { label: "Published", value: stats.publishedCount.toString(), icon: Eye, change: "Live now" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]} 👋</h2>
            <p className="text-muted-foreground">Here's what's happening with your websites.</p>
          </div>
          <div className="flex gap-3">
            <Button className="gradient-primary shadow-primary-glow" asChild>
              <Link to="/marketplace"><Plus className="mr-2 h-4 w-4" /> Create Website</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/marketplace"><Compass className="mr-2 h-4 w-4" /> Browse Templates</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="font-semibold text-foreground">Recent Projects</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-websites">View all</Link>
            </Button>
          </div>
          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <h4 className="font-semibold text-foreground">No projects yet</h4>
              <p className="mt-1 text-sm text-muted-foreground">Create your first website from a template</p>
              <Button className="mt-4 gradient-primary" size="sm" asChild>
                <Link to="/marketplace">Browse Templates</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground">Edited {timeAgo(project.lastEdited)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      project.status === "Published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}>{project.status}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/editor/${project.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
