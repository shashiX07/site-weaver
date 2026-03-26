import { motion } from "framer-motion";
import { Paintbrush, Code2, Zap, Store } from "lucide-react";

const features = [
  {
    icon: Paintbrush,
    title: "Edit Templates Visually",
    description: "Click on any element and customize it instantly. Change colors, fonts, images, and layout with an intuitive editor.",
  },
  {
    icon: Code2,
    title: "No Coding Required",
    description: "Build professional websites without writing a single line of code. Our visual editor handles everything.",
  },
  {
    icon: Zap,
    title: "Publish in Seconds",
    description: "One-click publishing to get your website live instantly. Custom domains supported.",
  },
  {
    icon: Store,
    title: "Template Marketplace",
    description: "Browse hundreds of professionally designed templates. Find the perfect starting point for your project.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 h-[300px] w-[300px] rounded-full bg-primary/8 blur-[80px]" />
        <div className="absolute bottom-10 left-10 h-[250px] w-[250px] rounded-full bg-primary/6 blur-[70px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to build
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools wrapped in a simple, beautiful interface.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-white/70"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-primary-glow">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
