"use client";
import { KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, KBarResults, useMatches } from "kbar";
import { useRouter } from "next/navigation";

export default function CommandPalette({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions = [
    {
      id: "dashboard",
      name: "Navigate: Dashboard",
      shortcut: ["g", "d"],
      keywords: "go home dashboard",
      perform: () => router.push("/dashboard"),
    },
    {
      id: "fleet",
      name: "Navigate: Fleet Directory",
      shortcut: ["g", "f"],
      keywords: "ships spacecraft fleet",
      perform: () => router.push("/spacecraft"),
    },
    {
      id: "scan",
      name: "System: Initiate Global Scan",
      shortcut: ["s"],
      keywords: "scan radar search",
      perform: () => alert("SCANNING SECTOR 07..."),
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="bg-black/80 backdrop-blur-md z-[100]">
          <KBarAnimator className="w-full max-w-[600px] bg-[#0a0a0a] border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,255,213,0.2)]">
            <div className="p-4 border-b border-white/5 text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
              Cosmo_Track // Terminal_v1.0
            </div>
            <KBarSearch className="w-full p-6 bg-transparent outline-none text-xl font-mono text-white placeholder:text-neutral-700" />
            <div className="pb-4">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

function RenderResults() {
  const { results } = useMatches();
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-6 py-2 text-[10px] uppercase text-neutral-500 font-bold tracking-widest">{item}</div>
        ) : (
          <div className={`px-6 py-4 flex justify-between cursor-pointer transition-colors font-mono ${active ? "bg-cyan-500/10 border-l-2 border-cyan-400" : "bg-transparent"}`}>
            <span className={active ? "text-cyan-400" : "text-neutral-400"}>{item.name}</span>
            {item.shortcut?.length ? (
              <div className="flex gap-2">
                {item.shortcut.map((s) => (
                  <kbd key={s} className="px-2 py-1 bg-neutral-900 text-neutral-500 text-[10px] rounded">{s}</kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
}