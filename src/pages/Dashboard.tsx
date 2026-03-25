import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Compass, Globe, LayoutTemplate, TrendingUp, Eye, Users } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Websites", value: "4", icon: Globe, change: "+1 this week" },
  { label: "Templates Used", value: "12", icon: LayoutTemplate, change: "+3 this month" },
  { label: "Total Views", value: "2.4K", icon: Eye, change: "+18%" },
  { label: "Visitors", value: "890", icon: Users, change: "+24%" },
];

const recentProjects = [
  { name: "My Portfolio", status: "Published", lastEdited: "2 hours ago" },
  { name: "Coffee Shop", status: "Draft", lastEdited: "Yesterday" },
  { name: "Tech Blog", status: "Published", lastEdited: "3 days ago" },
];

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, John 👋</h2>
            <p className="text-muted-foreground">Here's what's happening with your websites.</p>
          </div>
          <div className="flex gap-3">
            <Button className="gradient-primary shadow-primary-glow" asChild>
              <Link to="/editor"><Plus className="mr-2 h-4 w-4" /> Create Website</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/marketplace"><Compass className="mr-2 h-4 w-4" /> Browse Templates</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" /> {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="font-semibold text-foreground">Recent Projects</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-websites">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentProjects.map((project) => (
              <div key={project.name} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground">Edited {project.lastEdited}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    project.status === "Published"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {project.status}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/editor">Edit</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
