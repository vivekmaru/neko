import { cn } from "@/lib/cn";
import { useNeko } from "@/lib/store";
import { ArrowUp, ImagePlus, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

export function Composer({ sessionId, onStop }: { sessionId: string; onStop?: () => void }) {
  const value = useNeko((s) => s.composer);
  const setComposer = useNeko((s) => s.setComposer);
  const send = useNeko((s) => s.send);
  const session = useNeko((s) => s.sessions.find((x) => x.id === sessionId));
  const dictation = useNeko((s) => s.settings.dictation);
  const byokKey = useNeko((s) => s.settings.byokKey);
  const consumeDictation = useNeko((s) => s.consumeDictation);
  const busy = session?.status === "working" || session?.status === "thinking";
  const fileRef = useRef<HTMLInputElement>(null);
  const [listening, setListening] = useState(false);

  function submit() {
    if (busy) {
      onStop?.();
      return;
    }
    send(sessionId, value);
  }

  function dictate() {
    if (dictation === "whisper" && !byokKey.trim()) {
      toast("BYOK dictation", { description: "Add your API key in Settings → Agents." });
      return;
    }
    if (!consumeDictation(dictation === "cloud" ? 0.2 : 0)) {
      toast("Cloud dictation cap", { description: "That's the free 3 minutes. Unlock Pro for 60." });
      return;
    }
    const SR = (window as unknown as { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition
      ?? (window as unknown as { SpeechRecognition?: new () => SpeechRec }).SpeechRecognition;
    if (!SR) {
      setComposer(value ? value : "polish the onboarding copy");
      toast("Dictation", { description: dictation === "cloud" ? "Cloud transcript (demo)" : dictation === "whisper" ? "Whisper (demo key)" : "On-device (demo)" });
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onresult = (e: { results: { 0: { 0: { transcript: string } } } }) => {
      setComposer(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  function onFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => send(sessionId, value || "look at this screenshot", String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <form
      className="flex items-end gap-2 border-t border-border bg-surface px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <button
        type="button"
        className="press flex size-11 shrink-0 items-center justify-center rounded-md text-muted"
        aria-label="Attach image"
        onClick={() => fileRef.current?.click()}
      >
        <ImagePlus className="size-5" />
      </button>
      <label className="sr-only" htmlFor="neko-composer">
        Prompt
      </label>
      <textarea
        id="neko-composer"
        rows={1}
        value={value}
        placeholder={session?.view === "chat" ? "Message the agent" : "Type a command"}
        className="max-h-28 min-h-11 flex-1 resize-none bg-transparent py-2.5 text-sm outline-none placeholder:text-subtle"
        onChange={(e) => setComposer(e.target.value)}
        onPaste={(e) => {
          const item = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"));
          if (!item) return;
          e.preventDefault();
          onFile(item.getAsFile() ?? undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button
        type="button"
        className={cn("press flex size-11 shrink-0 items-center justify-center rounded-md", listening ? "text-accent" : "text-muted")}
        aria-label={listening ? "Listening" : `Dictate (${dictation})`}
        onClick={dictate}
      >
        <Mic className="size-5" />
      </button>
      <button
        type="submit"
        className="press flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-fg"
        aria-label={busy ? "Stop" : "Send"}
      >
        {busy ? <Square className="size-4 fill-current" /> : <ArrowUp className="size-5" />}
      </button>
    </form>
  );
}

type SpeechRec = {
  lang: string;
  start: () => void;
  onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
};
