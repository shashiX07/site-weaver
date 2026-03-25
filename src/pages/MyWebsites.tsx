import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getUserWebsites, publishWebsite, deleteWebsite, timeAgo } from "@/lib/store";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const MyWebsites = () => {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  if (!user) return null;
  const websites = getUserWebsites(user.id);

  const handlePublish = (id: string) => {
    publishWebsite(id);
    toast({ title: "Published! 🎉", description: "Your website is now live." });
    setRefresh((r) => r + 1);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteWebsite(id);
      toast({ title: "Deleted", description: `"${name}" has been deleted.` });
      setRefresh((r) => r + 1);
    }
  };

  return (
    <DashboardLayout title="My Websites">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Manage and publish your websites</p>
          <Button className="gradient-primary shadow-primary-glow" asChild>
            <Link to="/marketplace"><Plus className="mr-2 h-4 w-4" /> Create Website</Link>
          </Button>
        </div>

        {websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <Globe className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">No websites yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pick a template to create your first website</p>
            <Button className="mt-4 gradient-primary" asChild>
              <Link to="/marketplace">Browse Templates</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map((site) => (
              <div key={site.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-card-hover">
                <div className="relative aspect-video overflow-hidden">
                  <img src={site.image} alt={site.name} className="h-full w-full object-cover" loading="lazy" width={640} height={512} />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{site.name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      site.status === "Published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}>{site.status}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" /> {site.url}
                  </div>
                  <p className="text-xs text-muted-foreground">Edited {timeAgo(site.lastEdited)}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/editor/${site.id}`}><Edit className="mr-1.5 h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    {site.status === "Draft" ? (
                      <Button size="sm" className="gradient-primary" onClick={() => handlePublish(site.id)}>
                        <Globe className="mr-1.5 h-3.5 w-3.5" /> Publish
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5" /></Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(site.id, site.name)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyWebsites;
