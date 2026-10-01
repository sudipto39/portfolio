import { useEffect, useState, type ReactNode } from 'react';
import { Command } from 'cmdk';
import { Briefcase, Cpu, FileText, Folder, Home, Layers, Mail, MessageSquare, RotateCcw, Search, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { profile } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { PROVIDERS, type ProviderId } from '../lib/ai/config';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { GeminiMark, GroqMark, GithubIcon, Kbd, LinkedinIcon, ProviderIcon } from './shared';

const NAV = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About & Principles', icon: Users },
  { path: '/projects', label: 'Projects & Work', icon: Folder },
  { path: '/stack', label: 'Stack & 3D Orbit', icon: Layers },
  { path: '/experience', label: 'Experience & Career', icon: Briefcase },
  { path: '/ai-twin', label: 'AI Twin Studio', icon: Sparkles },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { ask, setProvider, reset, activeProvider } = useChat();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  /** Close the palette first, then act once the dialog has released focus & scroll lock. */
  const run = (fn: () => void, delay = 140) => {
    onOpenChange(false);
    window.setTimeout(fn, delay);
  };

  const goToPage = (path: string) => run(() => navigate(path), 120);

  const switchTo = (id: ProviderId) =>
    run(() => {
      setProvider(id);
      toast.success(id === 'demo' ? 'Switched to offline demo engine' : `Active engine: ${PROVIDERS[id].name}`);
    });

  const copyEmail = () =>
    run(() => {
      navigator.clipboard.writeText(profile.email).then(
        () => toast.success('Email copied'),
        () => toast.error('Clipboard unavailable')
      );
    }, 0);

  const openUrl = (url: string) => run(() => window.open(url, '_blank', 'noopener,noreferrer'), 0);

  const query = search.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="top-[14%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <DialogDescription className="sr-only">Jump to any page, switch AI provider or ask my AI twin a question.</DialogDescription>
        <Command loop className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
            <Search className="h-4 w-4 shrink-0 text-gray-500" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Jump to page, system, model, or ask AI…"
              className="h-14 w-full bg-transparent text-[15px] text-white outline-none placeholder:text-gray-500"
            />
            <Kbd>esc</Kbd>
          </div>

          <Command.List className="scrollbar-thin max-h-[min(60vh,420px)] overflow-y-auto p-2">
            <Command.Empty>No results found.</Command.Empty>

            {query && (
              <Command.Group heading="Ask AI" forceMount>
                <Item
                  forceMount
                  value={`ask-ai ${query}`}
                  icon={<Sparkles className="h-4 w-4 text-orange-300" />}
                  onSelect={() => run(() => ask(query))}
                >
                  Ask my AI twin: <span className="truncate text-orange-200">“{query}”</span>
                </Item>
              </Command.Group>
            )}

            <Command.Group heading="Navigate Pages">
              {NAV.map(({ path, label, icon: Icon }) => (
                <Item key={path} value={`go ${label}`} icon={<Icon className="h-4 w-4" />} onSelect={() => goToPage(path)}>
                  {label}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Architecture Case Studies">
              {profile.projects.map((project) => (
                <Item
                  key={project.id}
                  value={`case study ${project.title} ${project.category}`}
                  icon={<FileText className="h-4 w-4 text-orange-300" />}
                  onSelect={() => goToPage(`/projects/${project.id}`)}
                >
                  <span>{project.title}</span>
                  <span className="ml-auto font-mono text-[10px] text-gray-500">{project.category}</span>
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="AI Assistant">
              <Item value="open ai chat studio" icon={<MessageSquare className="h-4 w-4" />} onSelect={() => goToPage('/ai-twin')}>
                Open AI Twin Studio
              </Item>
              <Item value="use google gemini" icon={<GeminiMark className="h-4 w-4 text-orange-400" />} onSelect={() => switchTo('gemini')}>
                Use Google Gemini <span className="text-gray-500">Free API</span>
              </Item>
              <Item value="use groq high speed" icon={<GroqMark className="h-4 w-4 text-orange-400" />} onSelect={() => switchTo('groq')}>
                Use Groq <span className="text-gray-500">Llama 3.3</span>
              </Item>
              <Item value="use offline demo" icon={<Cpu className="h-4 w-4 text-orange-300" />} onSelect={() => switchTo('demo')}>
                Use offline demo engine
              </Item>
              <Item
                value="new conversation clear chat"
                icon={<RotateCcw className="h-4 w-4" />}
                onSelect={() =>
                  run(() => {
                    reset();
                    toast('Conversation cleared');
                  }, 0)
                }
              >
                New conversation
              </Item>
            </Command.Group>

            <Command.Group heading="Contact & Links">
              <Item value="download resume pdf cv" icon={<FileText className="h-4 w-4 text-orange-300" />} onSelect={() => openUrl(profile.resumeUrl)}>
                Download Resume <span className="text-gray-500 font-mono text-[10px]">PDF</span>
              </Item>
              <Item value="copy email" icon={<Mail className="h-4 w-4" />} onSelect={copyEmail}>
                Copy email <span className="truncate text-gray-500">{profile.email}</span>
              </Item>
              <Item value="github" icon={<GithubIcon className="h-4 w-4" />} onSelect={() => openUrl(profile.links.github)}>
                GitHub <span className="text-gray-500 font-mono text-[10px]">github.com/sudipto39</span>
              </Item>
              <Item value="linkedin" icon={<LinkedinIcon className="h-4 w-4" />} onSelect={() => openUrl(profile.links.linkedin)}>
                LinkedIn <span className="text-gray-500 font-mono text-[10px]">in/sudipto-gayen</span>
              </Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-2.5 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> navigate <Kbd>↵</Kbd> select
            </span>
            <span className="flex items-center gap-1.5">
              <ProviderIcon provider={activeProvider} className="h-3 w-3" />
              {PROVIDERS[activeProvider].name}
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function Item({
  children,
  icon,
  onSelect,
  value,
  forceMount,
}: {
  children: ReactNode;
  icon: ReactNode;
  onSelect: () => void;
  value: string;
  forceMount?: boolean;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      forceMount={forceMount}
      className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-none transition-colors data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/[0.08] bg-white/[0.03] text-gray-400">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-2 truncate">{children}</span>
    </Command.Item>
  );
}
