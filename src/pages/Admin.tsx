import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import tp1 from "@/assets/template-preview-1.jpg";
import tp2 from "@/assets/template-preview-2.jpg";
import tp3 from "@/assets/template-preview-3.jpg";
import tp4 from "@/assets/template-preview-4.jpg";

const pendingTemplates = [
  { name: "Modern Agency", author: "Jane Smith", image: tp1, date: "Mar 22, 2026" },
  { name: "Startup Kit", author: "Mike Chen", image: tp2, date: "Mar 20, 2026" },
  { name: "Fashion Store", author: "Sara Ali", image: tp3, date: "Mar 18, 2026" },
  { name: "Travel Blog", author: "Tom Brown", image: tp4, date: "Mar 15, 2026" },
];

const Admin = () => {
  return (
    <DashboardLayout title="Admin Panel">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Pending Review", value: "12", icon: Clock, color: "bg-warning/10 text-warning" },
            { label: "Approved", value: "248", icon: CheckCircle, color: "bg-success/10 text-success" },
            { label: "Rejected", value: "15", icon: XCircle, color: "bg-destructive/10 text-destructive" },
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

        {/* Template Approval Table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border p-5">
            <h3 className="font-semibold text-foreground">Pending Approvals</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Review and approve submitted templates</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Template</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uploaded By</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingTemplates.map((t) => (
                  <tr key={t.name} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={t.image} alt={t.name} className="h-10 w-14 rounded-md object-cover" loading="lazy" width={56} height={40} />
                        <span className="font-medium text-foreground">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{t.author}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{t.date}</td>
                    <td className="px-5 py-4">
                      <Button variant="ghost" size="sm"><Eye className="mr-1.5 h-3.5 w-3.5" /> View</Button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
