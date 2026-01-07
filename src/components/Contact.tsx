import { useState } from "react";
import { Github, Linkedin, Mail, MessageCircle, Send, Phone, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (trimmedName.length > 100) {
      toast({
        title: "Name too long",
        description: "Name must be less than 100 characters.",
        variant: "destructive",
      });
      return;
    }

    if (trimmedMessage.length > 5000) {
      toast({
        title: "Message too long",
        description: "Message must be less than 5000 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message sent! 🚀",
        description: "Thanks for reaching out! I'll get back to you soon. Check your email for confirmation.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/sudipto39",
      icon: Github,
      color: "hover:text-foreground",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/sudipto-gayen-7416b622b/",
      icon: Linkedin,
      color: "hover:text-primary",
    },
    {
      name: "Email",
      href: "mailto:sudipto002gayen@gmail.com",
      icon: Mail,
      color: "hover:text-gold",
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/918336833473",
      icon: Phone,
      color: "hover:text-green-500",
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div ref={ref} className={`scroll-animate ${isVisible ? "visible" : ""}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground mb-4">
              <MessageCircle className="h-4 w-4" />
              Get In Touch
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Let's Code{" "}
              <span className="text-gradient">Something Epic!</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind? Want to collaborate? Or just want to say hi?
              I'm always excited to connect with fellow developers and creators.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    maxLength={100}
                    disabled={isSubmitting}
                    className="rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    maxLength={255}
                    disabled={isSubmitting}
                    className="rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project or just say hello!"
                    required
                    maxLength={5000}
                    disabled={isSubmitting}
                    rows={5}
                    className="rounded-xl bg-secondary/50 border-border/50 focus:border-primary resize-none"
                  />
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-xl shadow-glow hover:shadow-glow transition-shadow"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Quick Contact Card */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-6">Quick Contact</h3>
                
                <div className="space-y-4">
                  <a
                    href="mailto:sudipto002gayen@gmail.com"
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">sudipto002gayen@gmail.com</div>
                    </div>
                  </a>
                  
                  <a
                    href="https://wa.me/918336833473"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div className="p-3 rounded-full bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-sm text-muted-foreground">+91 83368 33473</div>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Connect With Me</h3>
                
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-110 ${link.color}`}
                      aria-label={link.name}
                    >
                      <link.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Fun CTA */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-center">
                <p className="text-lg font-medium mb-2">
                  Open to freelance & full-time opportunities! 🎯
                </p>
                <p className="text-muted-foreground">
                  Based in Kolkata, West Bengal 🇮🇳
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
