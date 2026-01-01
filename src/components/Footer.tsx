import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <a href="#" className="text-xl font-bold text-gradient">
              &lt;Dev /&gt;
            </a>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive mx-1" />
            <span>using React & Tailwind CSS</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {currentYear} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
