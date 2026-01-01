import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const blogPosts = [
  {
    title: "Debugging OAuth Nightmares: A Survival Guide",
    excerpt:
      "That moment when your OAuth flow works perfectly in development but breaks mysteriously in production. Here's how I conquered the callback URL chaos...",
    date: "Dec 15, 2025",
    readTime: "5 min read",
    tags: ["OAuth", "Debugging", "Node.js"],
  },
  {
    title: "Why Redis Loves Your Sessions",
    excerpt:
      "Storing sessions in memory vs Redis - the performance gains are real. Let me show you how to implement lightning-fast session management...",
    date: "Nov 28, 2025",
    readTime: "7 min read",
    tags: ["Redis", "Sessions", "Performance"],
  },
  {
    title: "Building Your First RESTful API: A Beginner's Journey",
    excerpt:
      "From 'what is an endpoint?' to deploying a production-ready API. My learning path and the mistakes that taught me the most...",
    date: "Oct 10, 2025",
    readTime: "10 min read",
    tags: ["REST", "API", "Backend"],
  },
];

export const Blog = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="blog" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div ref={ref} className={`scroll-animate ${isVisible ? "visible" : ""}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-secondary-foreground mb-4">
              <BookOpen className="h-4 w-4" />
              Insights & Learnings
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Blog &{" "}
              <span className="text-gradient">Thoughts</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sharing my journey, discoveries, and occasional debugging adventures
              in the world of backend development.
            </p>
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.title}
                className="group glass-card overflow-hidden hover:border-primary/30 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header - Decorative */}
                <div className="h-2 bg-gradient-to-r from-primary via-purple to-gold" />
                
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Read More */}
                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto font-medium text-primary hover:bg-transparent"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              <BookOpen className="mr-2 h-5 w-5" />
              View All Articles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
