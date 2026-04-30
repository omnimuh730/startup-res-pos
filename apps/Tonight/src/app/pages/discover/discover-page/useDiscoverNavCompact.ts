import { useEffect, type RefObject } from "react";

export function useDiscoverNavCompact(
  hasSubView: boolean,
  discoverHeroSectionRef: RefObject<HTMLElement | null>,
  setDiscoverNavCompact: (v: boolean) => void,
) {
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main || hasSubView) {
      setDiscoverNavCompact(false);
      return undefined;
    }
    const readThreshold = () => {
      const hero = discoverHeroSectionRef.current;
      if (!hero) return 150;
      return Math.min(260, Math.max(140, Math.round(hero.offsetHeight * 0.52)));
    };
    const onScroll = () => setDiscoverNavCompact(main.scrollTop > readThreshold());
    main.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const heroEl = discoverHeroSectionRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && heroEl ? new ResizeObserver(() => onScroll()) : null;
    if (heroEl) ro?.observe(heroEl);
    onScroll();
    return () => {
      main.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro?.disconnect();
    };
  }, [hasSubView]);
}
