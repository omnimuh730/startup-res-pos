export function snapToNearestCard(container: HTMLDivElement) {
  const cards = Array.from(container.querySelectorAll("article"));
  if (!cards.length) return;
  const current = container.scrollLeft;
  let nearest = cards[0] as HTMLElement;
  let nearestDist = Math.abs((nearest as HTMLElement).offsetLeft - current);
  for (let i = 1; i < cards.length; i += 1) {
    const card = cards[i] as HTMLElement;
    const dist = Math.abs(card.offsetLeft - current);
    if (dist < nearestDist) {
      nearest = card;
      nearestDist = dist;
    }
  }
  container.scrollTo({ left: nearest.offsetLeft, behavior: "smooth" });
}
