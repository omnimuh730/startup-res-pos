import { useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import type { SheetState } from "./types";
import { getNearestSheetState, getSheetY } from "./filterUtils";

type ListPullState = {
  active: boolean;
  dragging: boolean;
  startX: number;
  startY: number;
  lastY: number;
  lastTime: number;
  velocityY: number;
};

type UseResultsListPullParams = {
  sheetState: SheetState;
  resultsListRef: RefObject<HTMLDivElement | null>;
  sheetHeight: number;
  peekHeight: number;
  setPreviewIndex: (index: number | null) => void;
  setSheetState: (state: SheetState) => void;
};

const createEmptyPull = (): ListPullState => ({
  active: false,
  dragging: false,
  startX: 0,
  startY: 0,
  lastY: 0,
  lastTime: 0,
  velocityY: 0,
});

export function useResultsListPull({
  sheetState,
  resultsListRef,
  sheetHeight,
  peekHeight,
  setPreviewIndex,
  setSheetState,
}: UseResultsListPullParams) {
  const [listPullOffset, setListPullOffset] = useState(0);
  const listPullRef = useRef<ListPullState>(createEmptyPull());

  const getDampedPullOffset = (deltaY: number) => {
    const maxOffset = sheetHeight > 0 ? getSheetY("peek", sheetHeight, peekHeight) : 420;
    const easedOffset = deltaY < 260 ? deltaY * 0.88 : 228.8 + (deltaY - 260) * 0.32;
    return Math.max(0, Math.min(maxOffset, easedOffset));
  };

  const resetListPull = () => {
    listPullRef.current = createEmptyPull();
    setListPullOffset(0);
  };

  const handleListPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (sheetState !== "full") return;
    if ((resultsListRef.current?.scrollTop ?? 0) > 1) return;
    const now = performance.now();
    listPullRef.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: now,
      velocityY: 0,
    };
  };

  const handleListPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pull = listPullRef.current;
    if (!pull.active) return;
    const now = performance.now();
    const deltaY = event.clientY - pull.startY;
    const deltaX = Math.abs(event.clientX - pull.startX);
    const elapsed = Math.max(16, now - pull.lastTime);
    pull.velocityY = ((event.clientY - pull.lastY) / elapsed) * 1000;
    pull.lastY = event.clientY;
    pull.lastTime = now;
    if (deltaY <= 0 || deltaX > Math.abs(deltaY)) return;
    if (!pull.dragging && (resultsListRef.current?.scrollTop ?? 0) > 1) return;
    if (deltaY > 18) {
      pull.dragging = true;
      setPreviewIndex(null);
      try {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      } catch {
        // Some browsers can reject late capture during native scroll handoff.
      }
      setListPullOffset(getDampedPullOffset(deltaY));
      if (event.cancelable) event.preventDefault();
    }
  };

  const handleListPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pull = listPullRef.current;
    if (!pull.active) return;
    const deltaY = pull.lastY - pull.startY;
    if (pull.dragging && event.cancelable) event.preventDefault();
    if (pull.dragging && deltaY > 36) {
      const projectedY = getDampedPullOffset(deltaY) + Math.max(0, pull.velocityY) * 0.18;
      const nextState = getNearestSheetState(projectedY, sheetHeight, peekHeight);
      setPreviewIndex(null);
      setSheetState(nextState === "full" ? "half" : nextState);
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
    listPullOffset,
    handleListPointerDown,
    handleListPointerMove,
    handleListPointerEnd,
    handleListPointerCancel,
  };
}
