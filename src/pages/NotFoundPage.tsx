import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { EASE, PageTransition } from '../components/shared';

export function NotFoundPage() {
  return (
    <PageTransition className="relative flex min-h-[80vh] items-center justify-center px-4 pt-32 pb-24">
      <div className="w-full max-w-lg">
        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/90 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-orange-400/80" />
            <span className="ml-3 font-mono text-[11px] text-gray-500">404 — route_not_found</span>
          </div>

          <div className="p-6 font-mono text-xs leading-relaxed">
            <div className="text-gray-300">
              <span className="text-orange-400">➜</span> <span className="text-amber-300">~</span> curl -I https://sudiptogayen.dev{window.location.hash || window.location.pathname}
            </div>
            <div className="mt-2 text-rose-400 font-semibold">
              HTTP/2 404 NOT FOUND
            </div>
            <div className="mt-1 text-gray-500">
              content-type: text/plain; charset=utf-8<br />
              server: envoy-edge-gw<br />
              x-request-id: req_404_deadbeef
            </div>
            <div className="mt-4 text-orange-200">
              Error: The requested route does not exist in this deployment.
            </div>
            <div className="mt-2 text-gray-400">
              Available routes: / · /about · /projects · /stack · /experience · /ai-twin · /contact
            </div>
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button asChild variant="gradient" className="group">
            <Link to="/">
              <Home className="h-4 w-4" /> Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="group">
            <Link to="/projects">
              Explore Projects <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
