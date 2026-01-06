import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { StarField } from "./StarField";
import heroRobot from "@/assets/hero-robot.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <StarField />
      
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple/10 rounded-full blur-3xl animate-float-slow" />
      
      <div className="container mx-auto px-4 md:px-6 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Open to opportunities
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Building Robust{" "}
              <span className="text-gradient">Backends</span>
              <br />
              with Heart & Code{" "}
              <span className="text-gradient-gold">✨</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              3rd Year B.Tech CSE student from West Bengal, India. Passionate about
              crafting secure, scalable applications with Node.js, Redis, and OAuth 2.0.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-glow hover:shadow-glow transition-shadow"
                asChild
              >
                <a href="#projects">View My Work</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-border/50 hover:bg-secondary/50"
                asChild
              >
                <a href="#contact">Get In Touch</a>
              </Button>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start pt-4">
              <a
                href="https://github.com/sudipto39"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary/50 hover:bg-secondary hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sudipto-gayen-7416b622b/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary/50 hover:bg-secondary hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:sudipto002gayen@gmail.com"
                className="p-3 rounded-full bg-secondary/50 hover:bg-secondary hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-full max-w-lg">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple/20 rounded-3xl blur-2xl animate-pulse-glow" />
              
              <img
                src={heroRobot}
                alt="Friendly robot coding with Node.js and Redis"
                className="relative w-full h-auto rounded-3xl shadow-card floating"
              />
              
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 px-4 py-2 rounded-full bg-card shadow-card border border-border/50 text-sm font-medium floating-delayed">
                Node.js 🚀
              </div>
              <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full bg-card shadow-card border border-border/50 text-sm font-medium floating-slow">
                Redis ⚡
              </div>
              <div className="absolute top-1/2 -right-8 px-4 py-2 rounded-full bg-card shadow-card border border-border/50 text-sm font-medium floating">
                OAuth 🔐
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-sm">Scroll to explore</span>
            <ArrowDown className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
