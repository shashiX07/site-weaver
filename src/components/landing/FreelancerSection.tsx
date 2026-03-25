import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, Upload, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FreelancerSection = () => {
  return (
    <section id="freelancers" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">For Freelancers</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              Earn by uploading templates
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Turn your design skills into passive income. Upload your HTML templates and earn every time someone uses them.
            </p>
            <Button size="lg" className="mt-8 gradient-primary shadow-primary-glow" asChild>
              <Link to="/signup">
                Start Selling Templates <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              { icon: Upload, title: "Easy Upload", desc: "Upload HTML/CSS files and preview images in minutes." },
              { icon: DollarSign, title: "Earn Revenue", desc: "Get paid for every template download and usage." },
              { icon: TrendingUp, title: "Track Analytics", desc: "Monitor your template performance and earnings." },
              { icon: DollarSign, title: "Fast Payouts", desc: "Receive your earnings with quick, reliable payouts." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card p-5 shadow-card">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreelancerSection;
