import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    title: "Redis Session Manager",
    description:
      "A robust session management system using Redis for lightning-fast session storage, integrated with Google OAuth via Passport.js for secure authentication.",
    tech: ["Node.js", "Redis", "Passport.js", "OAuth 2.0", "Express"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: true,
  },
  {
    title: "E-Commerce Backend API",
    description:
      "RESTful API powering a full-featured e-commerce platform with inventory management, order processing, and payment gateway integration.",
    tech: ["Node.js", "Express", "MongoDB", "Stripe", "JWT"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: true,
  },
  {
    title: "Real-time Chat Application",
    description:
      "WebSocket-powered chat application supporting private messaging, group chats, and real-time notifications with message persistence.",
    tech: ["Socket.io", "Node.js", "Redis", "React", "TypeScript"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: true,
  },
  {
    title: "Task Scheduler Service",
    description:
      "Distributed task scheduling service with priority queues, retry mechanisms, and comprehensive logging for background job processing.",
    tech: ["Node.js", "Bull Queue", "Redis", "PostgreSQL"],
    github: "https://github.com",
    featured: false,
  },
];

export const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="projects" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div ref={ref} className={`scroll-animate ${isVisible ? "visible" : ""}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-secondary-foreground mb-4">
              <Folder className="h-4 w-4" />
              Featured Work
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Projects That{" "}
              <span className="text-gradient">Spark Joy</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of backend projects showcasing my expertise in building
              scalable, secure, and performant applications.
            </p>
          </div>
          
          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group glass-card p-6 md:p-8 glow-effect hover:border-primary/30 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Folder className="h-6 w-6" />
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Project Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {project.featured && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        View Live Demo
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                View All on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
