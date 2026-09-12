import { FILE_TREE } from "@/lib/demo";
import { SheetFrame } from "@/components/sheets/jump-to";
import { ChevronRight, FileCode } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Node = { name: string; children?: Node[] };

export function FilesSheet({ onClose }: { onClose: () => void }) {
  return (
    <SheetFrame title="Repository" onClose={onClose}>
      <p className="mb-3 text-xs text-muted">~/src/neko · tap a file to share</p>
      <ul className="font-mono text-xs">
        {FILE_TREE.map((n) => (
          <Tree key={n.name} node={n} depth={0} path={n.name} />
        ))}
      </ul>
    </SheetFrame>
  );
}

function Tree({ node, depth, path }: { node: Node; depth: number; path: string }) {
  const [open, setOpen] = useState(depth < 1);
  const hasKids = !!node.children;
  return (
    <li>
      <button
        type="button"
        className="flex min-h-8 w-full items-center gap-1.5 text-left"
        style={{ paddingLeft: depth * 12 }}
        onClick={() => {
          if (hasKids) {
            setOpen((v) => !v);
            return;
          }
          void navigator.clipboard?.writeText(path);
          toast("Shared", { description: `${path} · AirDrop sheet (demo)` });
        }}
      >
        {hasKids ? (
          <ChevronRight className={`size-3.5 text-muted transition-transform ${open ? "rotate-90" : ""}`} />
        ) : (
          <FileCode className="size-3.5 text-cyan" />
        )}
        <span className={hasKids ? "text-fg" : "text-muted"}>{node.name}</span>
      </button>
      {hasKids && open ? (
        <ul>
          {node.children!.map((c) => (
            <Tree key={c.name} node={c} depth={depth + 1} path={`${path}/${c.name}`} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
