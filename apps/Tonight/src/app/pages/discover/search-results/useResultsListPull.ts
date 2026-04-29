import { useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import type { SheetState } from "./types";

type ListPullState = {
  active: boolean;
  dragging: boolean;
  startX: number;
  startY: number;
  lastY: number;
};

type UseResultsListPullParams = {
  sheetState: SheetState;
  resultsListRef: RefObject<HTMLDivElement | null>;
  setPreviewIndex: (index: number | null) => void;
  setSheetState: (state: SheetState) => void;
};

export function useResultsListPull({ sheetState, resultsListRef, setPreviewIndex, setSheetState }: UseResultsListPullParams) {
  const listPullRef = useRef<ListPullState>({ active: false, dragging: false, startX: 0, startY: 0, lastY: 0 });

  const resetListPull = () => {
    listPullRef.current = { active: false, dragging: false, startX: 0, startY: 0, lastY: 0 };
  };

  const handleListPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (sheetState !== "full") return;
    if ((resultsListRef.current?.scrollTop ?? 0) > 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    listPullRef.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
      lastY: event.clientY,
    };
  };

  const handleListPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pull = listPullRef.current;
    if (!pull.active) return;
    const deltaY = event.clientY - pull.startY;
    const deltaX = Math.abs(event.clientX - pull.startX);
    pull.lastY = event.clientY;
    if (deltaY <= 0 || deltaX > Math.abs(deltaY)) return;
    if (!pull.dragging && (resultsListRef.current?.scrollTop ?? 0) > 1) return;
    if (deltaY > 18) {
      pull.dragging = true;
      if (event.cancelable) event.preventDefault();
    }
    if (deltaY > 42 && sheetState === "full") {
      setPreviewIndex(null);
      setSheetState("half");
    }
  };

  const handleListPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pull = listPullRef.current;
    if (!pull.active) return;
    const deltaY = pull.lastY - pull.startY;
    if (pull.dragging && deltaY > 104) {
      setPreviewIndex(null);
      setSheetState("peek");
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetListPull();
  };

  const handleListPointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetListPull();
  };

  return {
    handleListPointerDown,
    handleListPointerMove,
    handleListPointerEnd,
    handleListPointerCancel,
  };
}
