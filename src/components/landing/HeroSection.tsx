import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import editorMockup from "@/assets/editor-mockup.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Vibrant background blobs for glass effect */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/20 blur-[80px]" />
        <div className="absolute top-20 left-1/3 h-[200px] w-[200px] rounded-full bg-primary/8 blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
              <Sparkle /> Now in Beta — Join 2,000+ creators
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Build Your Website{" "}
            <span className="text-gradient">Without Coding</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Choose a template, customize visually, and publish instantly.
            No coding skills required — just your creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="gradient-primary shadow-primary-glow px-8 text-base" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="glass px-8 text-base hover:bg-white/70" asChild>
              <Link to="/marketplace">
                <Play className="mr-2 h-4 w-4" />
                Explore Templates
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="glass relative rounded-2xl p-2 shadow-xl">
            <img
              src={editorMockup}
              alt="TemplatePro visual editor interface"
              className="w-full rounded-xl"
              width={1280}
              height={800}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Sparkle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
    <path d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z" fill="currentColor" />
  </svg>
);

export default HeroSection;
