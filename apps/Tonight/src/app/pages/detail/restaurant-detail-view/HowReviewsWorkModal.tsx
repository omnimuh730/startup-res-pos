export function HowReviewsWorkModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[340] bg-black/35 flex items-end justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-[2rem] bg-background p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.75rem] leading-tight" style={{ fontWeight: 700 }}>How reviews work</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-[1.8rem] leading-none cursor-pointer">×</button>
        </div>
        <div className="mt-4 text-[1rem] leading-7 text-foreground/90 space-y-5">
          <p>Reviews from past guests help our community learn more about each home. By default, reviews are sorted by relevancy.</p>
          <p>Only the guest who booked the reservation can leave a review, and Airbnb only moderates reviews flagged for not following policies.</p>
          <p>To be eligible for a percentile ranking or guest favorite label, listings need at least 5 reviews in the last 4 years.</p>
        </div>
        <button className="underline mt-4 text-[0.95rem] cursor-pointer" style={{ fontWeight: 600 }}>Learn more in our Help Center</button>
      </div>
    </div>
  );
}
