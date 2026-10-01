import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { Toaster } from 'sonner';
import { ChatProvider } from './hooks/use-chat';
import { TooltipProvider } from './components/ui/tooltip';
import { Navbar } from './components/sections/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AILauncher } from './components/ai/AILauncher';
import { CommandMenu } from './components/CommandMenu';
import { CustomCursor } from './components/CustomCursor';
import { AmbientGlow } from './components/shared';
import {
  HomePage,
  AboutPage,
  ProjectsPage,
  ProjectDetailPage,
  StackPage,
  ExperiencePage,
  AITwinPage,
  ContactPage,
  NotFoundPage,
} from './pages';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-linear-to-r from-orange-400 via-amber-400 to-orange-700"
    />
  );
}

function MainLayout() {
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();

  // ⌘K / Ctrl+K opens the command palette from anywhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink text-gray-100 flex flex-col justify-between">
      {/* Dynamic ambient floating atmospheric lights */}
      <AmbientGlow className="-top-32 left-1/4" color="rgba(251, 146, 60, 0.08)" size={650} />
      <AmbientGlow className="top-1/3 -right-40" color="rgba(217, 119, 87, 0.07)" size={700} />
      <AmbientGlow className="bottom-1/4 -left-40" color="rgba(245, 158, 11, 0.06)" size={600} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-gray-950"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Navbar onOpenCommand={() => setCommandOpen(true)} />

      <main id="main" className="flex-1 relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/work" element={<Navigate to="/projects" replace />} />
            <Route path="/stack" element={<StackPage />} />
            <Route path="/skills" element={<Navigate to="/stack" replace />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/ai-twin" element={<AITwinPage />} />
            <Route path="/ai" element={<Navigate to="/ai-twin" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />

      <AILauncher />
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      <CustomCursor />
      <Toaster theme="dark" position="bottom-center" richColors closeButton />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={250}>
        <ChatProvider>
          <HashRouter>
            <ScrollToTop />
            <MainLayout />
          </HashRouter>
        </ChatProvider>
      </TooltipProvider>
    </MotionConfig>
  );
}
