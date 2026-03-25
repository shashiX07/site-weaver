import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import tp1 from "@/assets/template-preview-1.jpg";
import tp2 from "@/assets/template-preview-2.jpg";
import tp3 from "@/assets/template-preview-3.jpg";
import tp4 from "@/assets/template-preview-4.jpg";
import tp5 from "@/assets/template-preview-5.jpg";
import tp6 from "@/assets/template-preview-6.jpg";

const templates = [
  { name: "SaaS Landing", category: "Business", image: tp1 },
  { name: "Dark Portfolio", category: "Portfolio", image: tp2 },
  { name: "E-Commerce", category: "Store", image: tp3 },
  { name: "Restaurant", category: "Food", image: tp4 },
  { name: "Blog Editorial", category: "Blog", image: tp5 },
  { name: "Fitness Pro", category: "Health", image: tp6 },
];

const TemplateShowcase = () => {
  return (
    <section id="templates" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Templates</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Popular Templates</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/marketplace">
              View All Templates <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, i) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={640}
                  height={512}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/40 group-hover:opacity-100">
                  <Button size="sm" className="gradient-primary shadow-primary-glow">
                    Use Template
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {template.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
