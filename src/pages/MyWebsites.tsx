import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Edit, ExternalLink, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import tp1 from "@/assets/template-preview-1.jpg";
import tp2 from "@/assets/template-preview-2.jpg";
import tp3 from "@/assets/template-preview-3.jpg";

const websites = [
  { name: "My Portfolio", url: "john.templatepro.com", status: "Published", image: tp1, lastEdited: "2 hours ago" },
  { name: "Coffee Shop", url: "coffeeshop.templatepro.com", status: "Draft", image: tp2, lastEdited: "Yesterday" },
  { name: "Tech Blog", url: "techblog.templatepro.com", status: "Published", image: tp3, lastEdited: "3 days ago" },
];

const MyWebsites = () => {
  return (
    <DashboardLayout title="My Websites">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Manage and publish your websites</p>
          <Button className="gradient-primary shadow-primary-glow" asChild>
            <Link to="/editor"><Plus className="mr-2 h-4 w-4" /> Create Website</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((site) => (
            <div key={site.name} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-card-hover">
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/editor"><Edit className="mr-1.5 h-3.5 w-3.5" /> Edit</Link>
                  </Button>
                  {site.status === "Published" ? (
                    <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5" /></Button>
                  ) : (
                    <Button size="sm" className="gradient-primary"><Globe className="mr-1.5 h-3.5 w-3.5" /> Publish</Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyWebsites;
