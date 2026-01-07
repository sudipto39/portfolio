import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const skills = [
  { name: "JavaScript", level: 85, tooltip: "Types make me happy 💙", color: "purple" },
  { name: "Node.js", level: 85, tooltip: "My trusty steed 🐎", color: "primary" },
  { name: "Express.js", level: 80, tooltip: "Routing like a pro 🛤️", color: "primary" },
  { name: "MongoDB", level: 75, tooltip: "Documents are my friends 📄", color: "gold" },
  { name: "OAuth 2.0", level: 60, tooltip: "Security is my middle name 🔐", color: "purple" },
  { name: "Redis", level: 50, tooltip: "Cache me if you can ⚡", color: "purple" },
  // { name: "PostgreSQL", level: 70, tooltip: "Relational reasoning 🗃️", color: "gold" },
  { name: "Java/DSA", level: 50, tooltip: "Algorithmic thinking 🧠", color: "primary" },
  
];

const technologies = [
  { name: "Git", category: "Tools" },
  // { name: "Docker", category: "DevOps" },
  { name: "REST APIs", category: "Backend" },
  // { name: "WebSockets", category: "Real-time" },
  { name: "Passport.js", category: "Auth" },
  { name: "JWT", category: "Security" },
  { name: "Linux", category: "Systems" },
  { name: "VS Code", category: "Tools" },
];

export const Skills = () => {
  const { ref, isVisible } = useScrollAnimation();

  const getColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "from-primary to-primary/70";
      case "purple":
        return "from-purple to-purple/70";
      case "gold":
        return "from-gold to-gold/70";
      default:
        return "from-primary to-primary/70";
    }
  };

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div ref={ref} className={`scroll-animate ${isVisible ? "visible" : ""}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground mb-4">
              <span>⚡</span> Technical Expertise
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Skills &{" "}
              <span className="text-gradient">Technologies</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Constantly learning and evolving. Here's my current tech stack
              and proficiency levels.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Skill Bars */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-primary rounded-full" />
                Core Skills
              </h3>
              
              {skills.map((skill, index) => (
                <Tooltip key={skill.name}>
                  <TooltipTrigger asChild>
                    <div
                      className="group cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getColorClass(skill.color)} ${isVisible ? "animate-progress" : ""}`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-card border-border">
                    <p>{skill.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            
            {/* Technologies Grid */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-purple rounded-full" />
                Technologies & Tools
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {technologies.map((tech, index) => (
                  <div
                    key={tech.name}
                    className="glass-card p-4 text-center hover:border-primary/30 hover:shadow-glow transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="text-lg font-medium group-hover:text-primary transition-colors">
                      {tech.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {tech.category}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Learning Section */}
              <div className="mt-8 p-6 glass-card border-dashed border-2">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">🌱</span> Currently Exploring
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["CRDTs", "WebSockets", "GoLang", "Generative AI"].map(
                    (item) => (
                      <span
                        key={item}
                        className="px-3 py-1 text-sm rounded-full bg-gold/10 text-gold border border-gold/30"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
