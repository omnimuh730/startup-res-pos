import { useState } from "react";
import { Plus, Edit3 } from "lucide-react";
import { useTheme } from "../theme-context";
import { useColors } from "./useColors";
import type { Floor } from "./types";

export function FloorTabsRow({
  floors,
  activeFloorId,
  setActiveFloorId,
  addFloor,
  setEditMode,
  onRenameFloor,
  showSeats,
  setShowSeats,
}: {
  floors: Floor[];
  activeFloorId: string;
  setActiveFloorId: (id: string) => void;
  addFloor: () => void;
  setEditMode: (v: boolean) => void;
  onRenameFloor: (id: string, name: string) => void;
  showSeats: boolean;
  setShowSeats: (v: boolean) => void;
}) {
  const C = useColors();
  const { role } = useTheme();
  const isAdmin = role === "Admin";
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  return (
    <div className="px-4 md:px-8 pt-4 pb-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 md:gap-6 flex-wrap">
        {floors.map((f) => {
          const isActive = f.id === activeFloorId;
          if (renamingId === f.id) {
            return (
              <input
                key={f.id}
                autoFocus
                value={renameVal}
                onChange={(e) => setRenameVal(e.target.value)}
                onBlur={() => { onRenameFloor(f.id, renameVal); setRenamingId(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") { onRenameFloor(f.id, renameVal); setRenamingId(null); } }}
                className="text-sm px-2 py-0.5 rounded border outline-none"
                style={{ color: C.text1, background: C.raised, borderColor: C.border, width: 80 }}
              />
            );
          }
          return (
            <button
              key={f.id}
              onClick={() => setActiveFloorId(f.id)}
              onDoubleClick={() => { setRenamingId(f.id); setRenameVal(f.name); }}
              className="text-sm cursor-pointer pb-1"
              style={{
                color: isActive ? C.text1 : C.text3,
                fontWeight: isActive ? 700 : 400,
                borderBottom: isActive ? `2px solid ${C.text1}` : "2px solid transparent",
              }}
              title="Double-click to rename"
            >
              {f.name}{" "}
              <span style={{ color: C.text2 }}>{f.tables.length}</span>
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 items-center">
        {isAdmin && (
          <button
            onClick={addFloor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-80 cursor-pointer text-sm"
            style={{ background: C.primary, color: "#ffffff" }}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Floor</span>
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-80 cursor-pointer text-sm"
            style={{ background: C.raised, color: C.text2 }}
          >
            <Edit3 size={15} />
            <span className="hidden sm:inline">Edit Layout</span>
          </button>
        )}
      </div>
    </div>
  );
}
