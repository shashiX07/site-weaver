import { motion } from "framer-motion";
import { LayoutTemplate, Palette, Globe } from "lucide-react";

const steps = [
  {
    icon: LayoutTemplate,
    step: "01",
    title: "Choose a Template",
    description: "Browse our marketplace and pick a template that fits your vision.",
  },
  {
    icon: Palette,
    step: "02",
    title: "Customize Visually",
    description: "Use our drag-and-drop editor to make it uniquely yours.",
  },
  {
    icon: Globe,
    step: "03",
    title: "Publish & Share",
    description: "Go live with one click and share your website with the world.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Three simple steps
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-primary-glow">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {step.step}</span>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden w-full -translate-x-1/2 md:block">
                  <div className="mx-auto h-px w-24 bg-border" style={{ marginLeft: "calc(50% + 60px)" }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
