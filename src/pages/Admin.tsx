import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { getPendingTemplates, getAdminStats, approveTemplate, rejectTemplate } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const [refresh, setRefresh] = useState(0);
  const stats = getAdminStats();
  const pendingTemplates = getPendingTemplates();

  const handleApprove = (id: string, name: string) => {
    approveTemplate(id);
    toast({ title: "Approved ✓", description: `"${name}" is now live in the marketplace.` });
    setRefresh((r) => r + 1);
  };

  const handleReject = (id: string, name: string) => {
    rejectTemplate(id);
    toast({ title: "Rejected", description: `"${name}" has been rejected.`, variant: "destructive" });
    setRefresh((r) => r + 1);
  };

  return (
    <DashboardLayout title="Admin Panel">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Pending Review", value: stats.pending.toString(), icon: Clock, color: "bg-warning/10 text-warning" },
            { label: "Approved", value: stats.approved.toString(), icon: CheckCircle, color: "bg-success/10 text-success" },
            { label: "Rejected", value: stats.rejected.toString(), icon: XCircle, color: "bg-destructive/10 text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border p-5">
            <h3 className="font-semibold text-foreground">Pending Approvals</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Review and approve submitted templates</p>
          </div>

          {pendingTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="mb-3 h-10 w-10 text-success/40" />
              <h4 className="font-semibold text-foreground">All caught up!</h4>
              <p className="mt-1 text-sm text-muted-foreground">No templates pending review</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Template</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uploaded By</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingTemplates.map((t) => (
                    <tr key={t.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={t.image} alt={t.name} className="h-10 w-14 rounded-md object-cover" loading="lazy" width={56} height={40} />
                          <div>
                            <span className="font-medium text-foreground">{t.name}</span>
                            <p className="text-xs text-muted-foreground">{t.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{t.authorName}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{t.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Button variant="ghost" size="sm"><Eye className="mr-1.5 h-3.5 w-3.5" /> View</Button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => handleApprove(t.id, t.name)}>
                            <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleReject(t.id, t.name)}>
                            <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
