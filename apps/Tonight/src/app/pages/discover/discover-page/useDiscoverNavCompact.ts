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
      if (!hero) return 96;
      return Math.min(180, Math.max(72, Math.round(hero.offsetHeight * 0.28)));
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
