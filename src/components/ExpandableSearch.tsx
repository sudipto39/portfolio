import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { EASE, Kbd } from './shared';

interface ExpandableSearchProps {
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
}

export function ExpandableSearch({
  isExpanded: controlledExpanded,
  onExpandedChange,
  className,
}: ExpandableSearchProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const setIsExpanded = (value: boolean) => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(value);
    }
    onExpandedChange?.(value);
  };

  const [query, setQuery] = useState('');
  const [isMac, setIsMac] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  // Close search when route changes
  useEffect(() => {
    setIsExpanded(false);
    setQuery('');
  }, [location.pathname]);

  // Focus input when search bar expands
  useEffect(() => {
    if (isExpanded) {
      window.setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [isExpanded]);

  // Global ⌘K / Ctrl+K shortcut to expand search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsExpanded(!isExpanded);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Close when clicking outside
  useEffect(() => {
    if (!isExpanded) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isExpanded]);

  // Handle Enter to submit search
  const handleSubmit = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    // Quick direct routes
    if (q === 'home' || q === 'main') {
      navigate('/');
    } else if (q === 'about' || q === 'bio' || q === 'education') {
      navigate('/about');
    } else if (q === 'stack' || q === 'skills' || q === 'orbit' || q === '3d') {
      navigate('/stack');
    } else if (q === 'experience' || q === 'career' || q === 'jobs') {
      navigate('/experience');
    } else if (q === 'ai' || q === 'twin' || q === 'chat') {
      navigate('/ai-twin');
    } else if (q === 'contact' || q === 'email' || q === 'hire') {
      navigate('/contact');
    } else {
      // Search projects
      navigate(`/projects?search=${encodeURIComponent(query.trim())}`);
    }

    setIsExpanded(false);
    setQuery('');
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsExpanded(false);
      setQuery('');
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          // ONLY SEARCH ICON (compact, sleek icon button)
          <motion.button
            key="search-icon-btn"
            type="button"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            aria-label="Search portfolio"
            title={`Search (${isMac ? '⌘' : 'Ctrl'}K)`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <Search className="h-4 w-4" />
          </motion.button>
        ) : (
          // EXPANDED SEARCH BAR ONLY (smooth inline expansion, no dropdown, no popup window)
          <motion.div
            key="search-expanded-bar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="relative flex h-9 w-36 sm:w-64 md:w-72 items-center rounded-lg border border-orange-500/35 bg-panel/95 pl-2.5 pr-1.5 shadow-lg shadow-black/30 ring-1 ring-orange-500/20"
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-orange-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search & hit Enter…"
              className="h-full w-full bg-transparent px-2.5 text-xs text-white placeholder:text-gray-500 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear query"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close search"
              className="ml-1 flex h-6 shrink-0 items-center justify-center rounded px-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
              title="Close search (Esc)"
            >
              <Kbd className="text-[9px] px-1 py-0.5">ESC</Kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
