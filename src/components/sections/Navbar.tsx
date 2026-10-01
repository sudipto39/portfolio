import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, Search, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { profile } from '../../data/profile';
import { useChat } from '../../hooks/use-chat';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../ui/sheet';
import { EASE, Kbd } from '../shared';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Work' },
  { path: '/stack', label: 'Stack' },
  { path: '/experience', label: 'Experience' },
  { path: '/ai-twin', label: 'AI Twin' },
  { path: '/contact', label: 'Contact' },
];

export function Navbar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { setChatOpen } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  const isItemActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  /** Close the mobile sheet, then navigate */
  const handleMobileNav = (path: string) => {
    setMobileOpen(false);
    window.setTimeout(() => navigate(path), 150);
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className={cn('mx-auto w-full max-w-[1700px] px-4 sm:px-8 lg:px-12 transition-all duration-300', scrolled ? 'pt-3' : 'pt-5')}>
        <nav
          aria-label="Primary"
          className={cn(
            'flex items-center gap-3 rounded-2xl border px-2.5 py-2 transition-all duration-300',
            scrolled
              ? 'border-white/[0.08] bg-panel/75 shadow-2xl shadow-black/40 backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          )}
        >
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 rounded-xl px-1 py-1">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs font-semibold text-orange-300 transition group-hover:border-orange-400/40">
              {profile.initials}
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-white sm:block">
              {profile.name}
              <span className="text-orange-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="mx-auto hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'relative isolate block rounded-lg px-3 py-1.5 text-sm transition-colors',
                      active ? 'text-white' : 'text-gray-400 hover:text-gray-100'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-lg bg-white/[0.08] ring-1 ring-white/15"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions: Command palette, Ask AI, Mobile hamburger */}
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <button
              type="button"
              onClick={onOpenCommand}
              className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] pl-3 pr-1.5 text-xs text-gray-400 transition hover:border-white/15 hover:text-gray-200 lg:flex"
            >
              <Search className="h-3.5 w-3.5" />
              Search
              <Kbd className="ml-4">{isMac ? '⌘' : 'Ctrl'} K</Kbd>
            </button>
            <Button size="sm" variant="gradient" className="h-9 rounded-lg px-3.5" onClick={() => setChatOpen(true)}>
              <Sparkles className="h-3.5 w-3.5" />
              Ask AI
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="h-9 w-9 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[84%] max-w-xs p-6">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <nav className="mt-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => {
              const active = isItemActive(item.path);
              return (
                <motion.button
                  key={item.path}
                  type="button"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, ease: EASE }}
                  onClick={() => handleMobileNav(item.path)}
                  className={cn(
                    'rounded-xl px-3 py-3 text-left text-base font-medium transition-colors',
                    active ? 'bg-orange-400/10 text-orange-200' : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                  )}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
          <div className="mt-auto space-y-2 pt-6 border-t border-white/[0.08]">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setMobileOpen(false);
                setTimeout(onOpenCommand, 200);
              }}
            >
              <Search className="h-4 w-4" /> Search &amp; commands
            </Button>
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => {
                setMobileOpen(false);
                setTimeout(() => setChatOpen(true), 200);
              }}
            >
              <Sparkles className="h-4 w-4" /> Ask my AI twin
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
