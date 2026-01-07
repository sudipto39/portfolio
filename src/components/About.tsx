import { Code2, Coffee, Heart, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import logo from "../assets/logo2.jpg";

export const About = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 items-center scroll-animate ${isVisible ? "visible" : ""}`}
        >
          {/* Avatar Section */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" style={{ padding: "20px" }} />
              
              {/* Avatar container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-glow">
                {/* <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Coffee className="h-16 w-16 mx-auto text-primary mb-4" />
                    <p className="text-lg font-medium text-foreground">Backend Developer</p>
                    <p className="text-sm text-muted-foreground">Kolkata, West Bengal</p>
                  </div>
                </div> */}
            <img
              src={logo}
              alt="Sudipto Gayen Logo"
              className="h-10 md:h-auto w-auto rounded-full transition-opacity duration-300 hover:opacity-80"
            />
              </div>
              
              {/* Floating icons */}
              <div className="absolute -top-4 right-0 p-3 rounded-full bg-card shadow-card border border-border/50 floating">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -bottom-4 left-0 p-3 rounded-full bg-card shadow-card border border-border/50 floating-delayed">
                <Heart className="h-6 w-6 text-destructive" />
              </div>
              <div className="absolute top-1/2 -left-8 p-3 rounded-full bg-card shadow-card border border-border/50 floating-slow">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground">
              <span>👋</span> About Me
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Passionate{" "}
              <span className="text-gradient">Backend Wizard</span>
              <br />
              Crafting Digital Magic
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hey there! I'm a 3rd-year B.Tech Computer Science student with an insatiable
              curiosity for backend development. From building secure authentication systems
              to optimizing database queries, I love diving deep into the server-side of things.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Currently exploring the fascinating worlds of{" "}
              <span className="text-primary font-medium">distributed systems (CRDTs)</span>,{" "}
              <span className="text-purple font-medium">WebSockets</span>, and{" "}
              <span className="text-gold font-medium">AI engineering</span>. When I'm not coding,
              you'll find me sipping chai and dreaming up new project ideas.
            </p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {[
                { label: "Projects", value: "5+" },
                { label: "Technologies", value: "10+" },
                { label: "Coffee Cups", value: "∞" },
                { label: "Passion Level", value: "💯" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-4 text-center hover:shadow-glow transition-shadow duration-300"
                >
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
