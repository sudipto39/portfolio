import { useEffect, useState, type ReactNode } from 'react';
import { Check, ExternalLink, Eye, EyeOff, KeyRound, LoaderCircle, Lock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { canGoLive, modelLabel, modelOptions, useChat, type AISettings } from '../../hooks/use-chat';
import { ENV, PROVIDER_ORDER, PROVIDERS, hostOf, type RemoteProvider } from '../../lib/ai/config';
import { listModels } from '../../lib/ai/providers';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { ProviderIcon } from '../shared';

function FieldLabel({ htmlFor, children, aside }: { htmlFor?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-3">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {children}
      </label>
      {aside}
    </div>
  );
}

export function AISettingsDialog() {
  const { settings, saveSettings, settingsOpen, closeSettings, settingsProvider } = useChat();
  const [draft, setDraft] = useState<AISettings>(settings);
  const [showKey, setShowKey] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [customModel, setCustomModel] = useState('');

  // Snapshot the saved settings each time the dialog opens.
  useEffect(() => {
    if (!settingsOpen) return;
    setDraft({ ...settings, provider: settingsProvider ?? settings.provider });
    setShowKey(false);
    setCustomModel('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOpen]);

  const provider = draft.provider;
  const meta = PROVIDERS[provider];
  const remote: RemoteProvider | null = provider === 'demo' ? null : provider;
  const options = modelOptions(draft, provider);

  const setModel = (id: string) => {
    if (!remote) return;
    const r = remote;
    setDraft((d) => ({ ...d, models: { ...d.models, [r]: id } }));
  };
  const setKey = (value: string) => {
    if (!remote) return;
    const r = remote;
    setDraft((d) => ({ ...d, keys: { ...d.keys, [r]: value } }));
  };
  const setEndpoint = (value: string) => {
    if (!remote) return;
    const r = remote;
    setDraft((d) => ({ ...d, endpoints: { ...d.endpoints, [r]: value } }));
  };

  const loadModels = async () => {
    if (!remote) return;
    const r = remote;
    const key = draft.keys[r].trim();
    const endpoint = draft.endpoints[r].trim() || ENV.endpoints[r];
    if (!key && !endpoint) {
      toast.error(`Add your ${PROVIDERS[r].name} API key first`);
      return;
    }
    setLoadingModels(true);
    try {
      const list = await listModels(r, key || undefined, endpoint || undefined);
      setDraft((d) => ({ ...d, extraModels: { ...d.extraModels, [r]: list } }));
      toast.success(`Found ${list.length} ${PROVIDERS[r].name} models`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t load models');
    } finally {
      setLoadingModels(false);
    }
  };

  const addCustomModel = () => {
    const id = customModel.trim();
    if (!remote || !id) return;
    const r = remote;
    setDraft((d) => ({
      ...d,
      models: { ...d.models, [r]: id },
      extraModels: {
        ...d.extraModels,
        [r]: [...d.extraModels[r].filter((m) => m.id !== id), { id, label: id, hint: 'Custom model ID' }],
      },
    }));
    setCustomModel('');
  };

  const save = () => {
    saveSettings(draft);
    closeSettings();
    const p = draft.provider;
    if (p === 'demo') {
      toast.success('Using the offline demo engine');
    } else if (canGoLive(draft, p)) {
      toast.success(`Connected to ${PROVIDERS[p].name}`, {
        description: `${modelLabel(draft, p, draft.models[p])} · keys stay in your browser`,
      });
    } else {
      toast.warning(`${PROVIDERS[p].name} selected — add an API key or endpoint to go live`);
    }
  };

  const targetHost = remote ? (draft.endpoints[remote].trim() ? hostOf(draft.endpoints[remote]) : meta.host) : '';

  return (
    <Dialog open={settingsOpen} onOpenChange={(open) => !open && closeSettings()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-orange-300" /> AI settings
          </DialogTitle>
          <DialogDescription>Choose the model behind my AI twin. Keys never leave your browser.</DialogDescription>
        </DialogHeader>

        {/* Provider */}
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="AI provider">
          {PROVIDER_ORDER.map((id) => {
            const m = PROVIDERS[id];
            const active = provider === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setDraft((d) => ({ ...d, provider: id }))}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition',
                  active
                    ? cn(m.accentBorder, m.accentBg, 'text-white')
                    : 'border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-gray-200'
                )}
              >
                <ProviderIcon provider={id} className="h-5 w-5" />
                <span className="font-medium">{m.name}</span>
                <span className="text-[10px] text-gray-500">{m.vendor}</span>
              </button>
            );
          })}
        </div>

        {/* Model */}
        <section className="space-y-2">
          <FieldLabel
            aside={
              remote && (
                <Button size="sm" variant="ghost" onClick={loadModels} disabled={loadingModels}>
                  {loadingModels ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Load from API
                </Button>
              )
            }
          >
            Model
          </FieldLabel>
          <div className="scrollbar-thin grid max-h-56 gap-2 overflow-y-auto pr-1">
            {options.map((o) => {
              const selected = provider === 'demo' || draft.models[provider] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setModel(o.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                    selected ? 'border-orange-400/40 bg-orange-400/[0.06]' : 'border-white/[0.07] hover:border-white/20'
                  )}
                >
                  <span
                    className={cn(
                      'grid h-4 w-4 shrink-0 place-items-center rounded-full border',
                      selected ? 'border-orange-300 bg-orange-300' : 'border-white/25'
                    )}
                  >
                    {selected && <Check className="h-2.5 w-2.5 text-gray-950" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white">{o.label}</span>
                    <span className="block truncate text-xs text-gray-500">{o.hint}</span>
                  </span>
                  <code className="hidden shrink-0 font-mono text-[10px] text-gray-500 sm:block">{o.id}</code>
                </button>
              );
            })}
          </div>
          {remote && (
            <div className="flex gap-2">
              <Input
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomModel()}
                placeholder="Or add a custom model ID…"
                aria-label="Custom model ID"
                className="h-9 font-mono text-xs"
              />
              <Button size="sm" variant="outline" className="h-9" onClick={addCustomModel} disabled={!customModel.trim()}>
                Add
              </Button>
            </div>
          )}
        </section>

        {remote ? (
          <>
            {/* API key */}
            <section className="space-y-2">
              <FieldLabel
                htmlFor="ai-key"
                aside={
                  meta.keyUrl && (
                    <a
                      href={meta.keyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-orange-300 hover:underline"
                    >
                      Get a key <ExternalLink className="h-3 w-3" />
                    </a>
                  )
                }
              >
                {meta.name} API key
              </FieldLabel>
              <div className="relative">
                <Input
                  id="ai-key"
                  type={showKey ? 'text' : 'password'}
                  autoComplete="off"
                  spellCheck={false}
                  value={draft.keys[remote]}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={meta.keyPlaceholder}
                  className="pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 transition hover:text-gray-200"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </section>

            {/* Endpoint */}
            <section className="space-y-2">
              <FieldLabel htmlFor="ai-endpoint">
                Custom endpoint <span className="normal-case tracking-normal text-gray-600">(optional)</span>
              </FieldLabel>
              <Input
                id="ai-endpoint"
                value={draft.endpoints[remote]}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder={ENV.endpoints[remote] || meta.defaultEndpoint}
                spellCheck={false}
                className="font-mono text-xs"
              />
              <p className="text-xs text-gray-500">
                Point to your own proxy to keep the key server-side. Leave blank to call {meta.host} directly.
              </p>
            </section>

            {remote === 'deepseek' && (
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/[0.07] px-3 py-3">
                <span>
                  <span className="block text-sm text-white">Thinking mode</span>
                  <span className="block text-xs text-gray-500">Stream DeepSeek’s chain-of-thought before the answer (slower).</span>
                </span>
                <Switch
                  checked={draft.deepseekThinking}
                  onCheckedChange={(v) => setDraft((d) => ({ ...d, deepseekThinking: v }))}
                />
              </label>
            )}

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/[0.07] px-3 py-3">
              <span>
                <span className="block text-sm text-white">Remember keys on this device</span>
                <span className="block text-xs text-gray-500">
                  {draft.remember ? 'Stored in localStorage until you clear it.' : 'Session only — forgotten when you close the tab.'}
                </span>
              </span>
              <Switch checked={draft.remember} onCheckedChange={(v) => setDraft((d) => ({ ...d, remember: v }))} />
            </label>

            <div className="flex items-start gap-2 rounded-xl border border-orange-400/15 bg-orange-400/[0.05] p-3 text-xs leading-relaxed text-orange-100/80">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-300" />
              <span>
                Your key is only ever sent to <strong className="font-medium text-orange-200">{targetHost}</strong>. Nothing is
                logged or sent to my servers. Tip: use a restricted key with a spend limit.
              </span>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm leading-relaxed text-gray-400">
            {meta.description} No key and no network — answers are generated in your browser from the same data that renders
            this page.
          </div>
        )}

        <DialogFooter>
          {remote && draft.keys[remote] && (
            <Button variant="ghost" className="text-rose-300 hover:text-rose-200 sm:mr-auto" onClick={() => setKey('')}>
              Clear key
            </Button>
          )}
          <Button variant="ghost" onClick={closeSettings}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={save}>
            Save settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
