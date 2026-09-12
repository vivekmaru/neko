import { CatMark } from "@/components/cat-mark";
import { SheetFrame } from "@/components/sheets/jump-to";

export function PreviewSheet({ onClose }: { onClose: () => void }) {
  return (
    <SheetFrame title="Browser preview" onClose={onClose}>
      <p className="mb-3 text-xs text-muted">http://127.0.0.1:5173 · host local</p>
      <div className="overflow-hidden rounded-lg border border-border bg-bg">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2 text-[11px] text-muted">
          <span className="size-2 rounded-full bg-red/80" />
          <span className="size-2 rounded-full bg-yellow/80" />
          <span className="size-2 rounded-full bg-green/80" />
          <span className="ml-2 font-mono">localhost:5173</span>
        </div>
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6">
          <CatMark className="size-12" />
          <p className="text-sm font-medium">Neko</p>
          <p className="text-xs text-muted">Demo preview of the host Vite server</p>
        </div>
      </div>
    </SheetFrame>
  );
}
