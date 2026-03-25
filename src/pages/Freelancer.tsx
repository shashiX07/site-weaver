import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

const myTemplates = [
  { name: "Modern Agency", status: "Approved", downloads: 142, date: "Jan 15, 2026" },
  { name: "Startup Kit", status: "Pending", downloads: 0, date: "Mar 20, 2026" },
  { name: "Minimalist CV", status: "Rejected", downloads: 0, date: "Feb 10, 2026" },
];

const statusConfig = {
  Approved: { icon: CheckCircle, className: "bg-success/10 text-success" },
  Pending: { icon: Clock, className: "bg-warning/10 text-warning" },
  Rejected: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
};

const Freelancer = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "templates">("upload");

  return (
    <DashboardLayout title="Freelancer Dashboard">
      <div className="space-y-6">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <Button variant={activeTab === "upload" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("upload")} className={activeTab === "upload" ? "gradient-primary" : ""}>
            <Upload className="mr-2 h-3.5 w-3.5" /> Upload Template
          </Button>
          <Button variant={activeTab === "templates" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("templates")} className={activeTab === "templates" ? "gradient-primary" : ""}>
            <FileText className="mr-2 h-3.5 w-3.5" /> My Templates
          </Button>
        </div>

        {activeTab === "upload" && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-card">
            <h2 className="text-xl font-semibold text-foreground">Upload a New Template</h2>
            <p className="mt-1 text-sm text-muted-foreground">Submit your template for review and start earning</p>

            <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input placeholder="e.g., Modern Landing Page" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your template..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option>Business</option>
                  <option>Portfolio</option>
                  <option>Store</option>
                  <option>Blog</option>
                  <option>Food</option>
                  <option>Health</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>HTML/CSS Files</Label>
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:border-primary/30">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium text-foreground">Drag & drop files here</p>
                    <p className="mt-1 text-xs text-muted-foreground">or click to browse (HTML, CSS, JS)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preview Image</Label>
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:border-primary/30">
                  <div className="text-center">
                    <Image className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium text-foreground">Upload preview image</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
              <Button className="w-full gradient-primary shadow-primary-glow" size="lg">
                Submit for Review
              </Button>
            </form>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Template</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Downloads</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myTemplates.map((t) => {
                  const sc = statusConfig[t.status as keyof typeof statusConfig];
                  return (
                    <tr key={t.name} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-4 font-medium text-foreground">{t.name}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.className}`}>
                          <sc.icon className="h-3 w-3" /> {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{t.downloads}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{t.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Freelancer;
