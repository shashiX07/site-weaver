import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getApprovedTemplates, createWebsite } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const categories = ["All", "Business", "Portfolio", "Store", "Blog", "Food", "Health"];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const templates = getApprovedTemplates();
  const filtered = templates.filter(
    (t) =>
      (activeCategory === "All" || t.category === activeCategory) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseTemplate = (templateId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const result = createWebsite(templateId);
    if (typeof result === "string") {
      toast({ title: "Error", description: result, variant: "destructive" });
    } else {
      toast({ title: "Website created!", description: `"${result.name}" has been created from this template.` });
      navigate(`/editor/${result.id}`);
    }
  };

  return (
    <DashboardLayout title="Template Marketplace">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? "gradient-primary" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <div key={template.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
              <div className="relative aspect-[5/4] overflow-hidden">
                <img src={template.image} alt={template.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width={640} height={512} />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/40 group-hover:opacity-100">
                  <Button size="sm" className="gradient-primary shadow-primary-glow" onClick={() => handleUseTemplate(template.id)}>
                    Use Template
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{template.category}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{template.downloads} downloads</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No templates found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
