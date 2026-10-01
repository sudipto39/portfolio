import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { profile } from '../../data/profile';
import { useChat } from '../../hooks/use-chat';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../ui/sheet';
import { ChatPanel } from './ChatPanel';

/** Floating "Ask my AI twin" button + slide-over chat. Hidden while the embedded chat is on screen. */
export function AILauncher() {
  const { chatOpen, setChatOpen, embeddedVisible, isStreaming } = useChat();
  const showButton = !chatOpen && !embeddedVisible;

  return (
    <>
      <AnimatePresence>
        {showButton && (
          <motion.button
            key="ai-launcher"
            type="button"
            onClick={() => setChatOpen(true)}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-white/10 bg-panel/85 py-2 pl-2 pr-4 text-sm font-medium text-white shadow-2xl shadow-orange-500/20 backdrop-blur-xl sm:bottom-6 sm:right-6"
            aria-label={`Ask ${profile.firstName}'s AI twin`}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-orange-300 to-amber-600">
              <span className="absolute inset-0 animate-ping rounded-full bg-orange-400/40 [animation-duration:2.6s]" />
              <Sparkles className="relative h-4 w-4 text-gray-950" />
            </span>
            <span className="hidden sm:inline">Ask my AI twin</span>
            <span className="sm:hidden">Ask AI</span>
            {isStreaming && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />}
          </motion.button>
        )}
      </AnimatePresence>

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent
          side="right"
          hideClose
          className="gap-0 p-0 sm:max-w-[440px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetTitle className="sr-only">Chat with {profile.firstName}&apos;s AI twin</SheetTitle>
          <SheetDescription className="sr-only">Ask about projects, skills, experience and availability.</SheetDescription>
          <ChatPanel autoFocus onClose={() => setChatOpen(false)} className="flex-1" />
        </SheetContent>
      </Sheet>
    </>
  );
}
