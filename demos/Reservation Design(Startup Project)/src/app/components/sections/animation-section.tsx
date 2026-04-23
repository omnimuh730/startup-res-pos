import { useState } from "react";
import { motion } from "motion/react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Animate, Stagger, StaggerItem, Button } from "../ds";
import {
  RotateCcw, Heart, Bookmark, Send, ShoppingCart, Check,
  Bell, Download, Trash2, Plus, ArrowRight, RefreshCw,
  ThumbsUp, Star, Copy, Share2, Zap, Loader2,
} from "lucide-react";

type AnimationPreset =
  | "fadeIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight"
  | "slideUp" | "slideDown" | "slideLeft" | "slideRight"
  | "scaleIn" | "scaleInBounce" | "rotate" | "flip" | "blur";

type HoverPreset = "pulse" | "shake" | "bounce" | "swing" | "rubberBand";

const mountPresets: AnimationPreset[] = [
  "fadeIn", "fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight",
  "slideUp", "slideDown", "slideLeft", "slideRight",
  "scaleIn", "scaleInBounce", "rotate", "flip", "blur",
];

const hoverPresets: HoverPreset[] = [
  "pulse", "shake", "bounce", "swing", "rubberBand",
];

// ── Micro-animation button demos ───────────────────────────
function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={() => setLiked(!liked)}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem]"
    >
      <motion.span
        animate={liked ? { scale: [1, 1.5, 0.8, 1.2, 1], rotate: [0, -15, 15, -5, 0] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heart
          className={`w-4.5 h-4.5 transition-colors ${liked ? "text-destructive fill-destructive" : "text-muted-foreground"}`}
        />
      </motion.span>
      <span>{liked ? "Liked" : "Like"}</span>
    </button>
  );
}

function BookmarkButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => setSaved(!saved)}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem]"
    >
      <motion.span
        animate={saved ? { y: [0, -8, 0], scale: [1, 1.2, 1] } : { y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Bookmark
          className={`w-4.5 h-4.5 transition-colors ${saved ? "text-warning fill-warning" : "text-muted-foreground"}`}
        />
      </motion.span>
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}

function AddToCartButton() {
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer text-[0.8125rem] ${
        added ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground hover:opacity-90"
      }`}
    >
      <motion.span
        animate={added ? { rotate: [0, -30, 0], scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        {added ? <Check className="w-4.5 h-4.5" /> : <ShoppingCart className="w-4.5 h-4.5" />}
      </motion.span>
      <span>{added ? "Added!" : "Add to Cart"}</span>
    </button>
  );
}

function SendButton() {
  const [sent, setSent] = useState(false);
  return (
    <button
      onClick={() => {
        setSent(true);
        setTimeout(() => setSent(false), 2000);
      }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-info text-info-foreground hover:opacity-90 transition-all cursor-pointer text-[0.8125rem]"
    >
      <motion.span
        animate={sent ? { x: [0, 30], opacity: [1, 0] } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Send className="w-4 h-4" />
      </motion.span>
      <span>{sent ? "Sent!" : "Send"}</span>
    </button>
  );
}

function NotifyButton() {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => {
        setActive(true);
        setTimeout(() => setActive(false), 1000);
      }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem] relative"
    >
      <motion.span
        animate={active ? {
          rotate: [0, 15, -15, 12, -12, 8, -8, 0],
          scale: [1, 1.15, 1.15, 1.1, 1.1, 1.05, 1.05, 1],
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <Bell className="w-4.5 h-4.5" />
      </motion.span>
      <span>Notify</span>
      {active && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"
        />
      )}
    </button>
  );
}

function DeleteButton() {
  const [deleting, setDeleting] = useState(false);
  return (
    <button
      onClick={() => {
        setDeleting(true);
        setTimeout(() => setDeleting(false), 1500);
      }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-[0.8125rem]"
    >
      <motion.span
        animate={deleting ? { rotate: [0, -20, 20, -20, 0], y: [0, -2, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Trash2 className="w-4 h-4" />
      </motion.span>
      <span>{deleting ? "Deleting..." : "Delete"}</span>
    </button>
  );
}

function DownloadButton() {
  const [downloading, setDownloading] = useState(false);
  return (
    <button
      onClick={() => {
        setDownloading(true);
        setTimeout(() => setDownloading(false), 2000);
      }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer text-[0.8125rem]"
    >
      <motion.span
        animate={downloading ? { y: [0, 3, 0] } : {}}
        transition={{ duration: 0.5, repeat: downloading ? Infinity : 0 }}
      >
        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </motion.span>
      <span>{downloading ? "Downloading..." : "Download"}</span>
    </button>
  );
}

function StarRatingButton() {
  const [rating, setRating] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.button
          key={i}
          onClick={() => setRating(i === rating ? 0 : i)}
          whileTap={{ scale: 0.75 }}
          animate={i <= rating ? { scale: [1, 1.4, 1], rotate: [0, -20, 0] } : { scale: 1 }}
          transition={{ duration: 0.3, delay: i <= rating ? (i - 1) * 0.06 : 0 }}
          className="p-1 cursor-pointer"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              i <= rating ? "text-warning fill-warning" : "text-muted-foreground/40"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}

function CopyButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem]"
    >
      <motion.span
        animate={copied ? { scale: [0, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      </motion.span>
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

function PlusCounter() {
  const [count, setCount] = useState(0);
  return (
    <div className="inline-flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.85, rotate: -90 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={() => setCount((c) => c + 1)}
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer"
      >
        <Plus className="w-5 h-5" />
      </motion.button>
      <motion.span
        key={count}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-[1.25rem] w-8 text-center"
      >
        {count}
      </motion.span>
    </div>
  );
}

export function AnimationSection() {
  const [mountKey, setMountKey] = useState(0);
  const [staggerKey, setStaggerKey] = useState(0);

  const replay = () => setMountKey((k) => k + 1);
  const replayStagger = () => setStaggerKey((k) => k + 1);

  return (
    <SectionWrapper
      id="animation-ds"
      title="Animations"
      description="Reusable micro-animation component with 18+ presets. Supports mount, hover, tap, and in-view triggers with stagger support — plus icon micro-interactions for buttons."
    >
      {/* ── Micro-Interactions (NEW) ─────────────────────────── */}
      <ComponentCard title="Micro-Interactions — Icon Animations in Buttons">
        <p className="text-[0.75rem] text-muted-foreground mb-4">
          Click each button to see its icon micro-animation. These patterns are used in DoorDash, Airbnb, and OpenTable-style apps.
        </p>
        <div className="flex flex-wrap gap-3">
          <LikeButton />
          <BookmarkButton />
          <AddToCartButton />
          <SendButton />
          <NotifyButton />
          <DeleteButton />
          <DownloadButton />
          <CopyButton />
        </div>
      </ComponentCard>

      <ComponentCard title="Interactive Star Rating">
        <p className="text-[0.75rem] text-muted-foreground mb-3">Click stars — each animates with a cascade</p>
        <StarRatingButton />
      </ComponentCard>

      <ComponentCard title="Animated Counter">
        <p className="text-[0.75rem] text-muted-foreground mb-3">Tap the + button — icon rotates and counter slides in</p>
        <PlusCounter />
      </ComponentCard>

      <ComponentCard title="Button Hover Icon Effects">
        <p className="text-[0.75rem] text-muted-foreground mb-4">Hover to see icons animate</p>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover="hovered"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 cursor-pointer text-[0.8125rem]"
          >
            Explore
            <motion.span variants={{ hovered: { x: 5 } }} transition={{ type: "spring", stiffness: 300 }}>
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>

          <motion.button
            whileHover="hovered"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary cursor-pointer text-[0.8125rem]"
          >
            <motion.span variants={{ hovered: { rotate: 180 } }} transition={{ duration: 0.4 }}>
              <RefreshCw className="w-4 h-4" />
            </motion.span>
            Refresh
          </motion.button>

          <motion.button
            whileHover="hovered"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary cursor-pointer text-[0.8125rem]"
          >
            <motion.span variants={{ hovered: { y: -3, scale: 1.15 } }} transition={{ type: "spring" }}>
              <ThumbsUp className="w-4 h-4" />
            </motion.span>
            Upvote
          </motion.button>

          <motion.button
            whileHover="hovered"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary cursor-pointer text-[0.8125rem]"
          >
            Share
            <motion.span variants={{ hovered: { rotate: 15, scale: 1.2 } }} transition={{ type: "spring" }}>
              <Share2 className="w-4 h-4" />
            </motion.span>
          </motion.button>

          <motion.button
            whileHover="hovered"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-warning text-warning-foreground hover:opacity-90 cursor-pointer text-[0.8125rem]"
          >
            <motion.span variants={{ hovered: { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } }} transition={{ duration: 0.5 }}>
              <Zap className="w-4 h-4" />
            </motion.span>
            Boost
          </motion.button>
        </div>
      </ComponentCard>

      {/* ── Original sections ─────────────────────────────── */}
      <ComponentCard title="Mount Animations">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={replay}
          >
            Replay All
          </Button>
          <span className="text-[0.75rem] text-muted-foreground">Click to replay mount animations</span>
        </div>
        <div key={mountKey} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {mountPresets.map((preset, i) => (
            <Animate key={preset} preset={preset} delay={i * 0.06} duration={0.5}>
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mx-auto mb-2">
                  <span className="text-[1rem]">✦</span>
                </div>
                <p className="text-[0.6875rem] font-mono text-muted-foreground">{preset}</p>
              </div>
            </Animate>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Hover Animations">
        <p className="text-[0.75rem] text-muted-foreground mb-4">Hover over each card to see the animation</p>
        <div className="flex flex-wrap gap-3">
          {hoverPresets.map((preset) => (
            <Animate key={preset} preset={preset} trigger="hover">
              <div className="px-5 py-4 rounded-xl border border-border bg-card text-center cursor-pointer hover:border-primary/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-2">
                  <span className="text-[0.875rem]">⚡</span>
                </div>
                <p className="text-[0.6875rem] font-mono text-muted-foreground">{preset}</p>
              </div>
            </Animate>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="In-View Animations">
        <p className="text-[0.75rem] text-muted-foreground mb-4">Scroll to see these appear (trigger="inView")</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["fadeInUp", "scaleIn", "fadeInRight"] as const).map((preset, i) => (
            <Animate key={preset} preset={preset} trigger="inView" delay={i * 0.15} duration={0.6}>
              <div className="p-6 rounded-xl border border-border bg-card">
                <h4 className="text-[0.9375rem] mb-1">{preset}</h4>
                <p className="text-[0.8125rem] text-muted-foreground">
                  This card animates when scrolled into view.
                </p>
              </div>
            </Animate>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Stagger Animation">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={replayStagger}
          >
            Replay Stagger
          </Button>
        </div>
        <Stagger key={staggerKey} stagger={0.08} delayStart={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }, (_, i) => (
              <StaggerItem key={i} preset="fadeInUp">
                <div className="p-4 rounded-xl border border-border bg-card text-center">
                  <div
                    className="w-full h-20 rounded-lg mb-2"
                    style={{
                      background: `hsl(${(i * 45) % 360}, 70%, 90%)`,
                    }}
                  />
                  <p className="text-[0.75rem] text-muted-foreground">Item {i + 1}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </ComponentCard>

      <ComponentCard title="Tap Animation">
        <p className="text-[0.75rem] text-muted-foreground mb-4">Click/tap these elements</p>
        <div className="flex flex-wrap gap-3">
          <Animate preset="scaleIn" trigger="tap">
            <Button variant="primary" size="md">Tap Scale</Button>
          </Animate>
          <Animate preset="shake" trigger="tap">
            <Button variant="outline" size="md">Tap Shake</Button>
          </Animate>
          <Animate preset="rubberBand" trigger="tap">
            <Button variant="secondary" size="md">Tap Rubber</Button>
          </Animate>
        </div>
      </ComponentCard>

      <ComponentCard title="Custom Duration & Delay">
        <div className="space-y-4">
          {[
            { duration: 0.2, label: "Fast (0.2s)" },
            { duration: 0.5, label: "Normal (0.5s)" },
            { duration: 1.0, label: "Slow (1.0s)" },
            { duration: 2.0, label: "Very Slow (2.0s)" },
          ].map((item, i) => (
            <Animate
              key={`${mountKey}-${i}`}
              preset="fadeInRight"
              duration={item.duration}
              delay={i * 0.1}
            >
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div className="h-2 flex-1 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${100 - i * 20}%` }} />
                </div>
                <span className="text-[0.75rem] font-mono text-muted-foreground w-28 text-right">{item.label}</span>
              </div>
            </Animate>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Repeat / Loop">
        <div className="flex flex-wrap gap-6 items-center">
          <Animate preset="pulse" trigger="mount" repeat="infinity" duration={1.5}>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary" />
            </div>
          </Animate>
          <div>
            <p className="text-[0.8125rem]">Infinite Pulse</p>
            <p className="text-[0.75rem] text-muted-foreground font-mono">repeat="infinity"</p>
          </div>

          <Animate preset="bounce" trigger="mount" repeat="infinity" duration={0.8}>
            <div className="w-8 h-8 rounded-full bg-info" />
          </Animate>
          <div>
            <p className="text-[0.8125rem]">Infinite Bounce</p>
            <p className="text-[0.75rem] text-muted-foreground font-mono">repeat="infinity"</p>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Practical Examples">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Notification Toast */}
          <div>
            <p className="text-[0.75rem] text-muted-foreground font-mono mb-3">Toast Notification</p>
            <Animate key={`toast-${mountKey}`} preset="slideRight" duration={0.4}>
              <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-success text-[0.875rem]">✓</span>
                </div>
                <div>
                  <p className="text-[0.8125rem]">Changes saved successfully</p>
                  <p className="text-[0.75rem] text-muted-foreground">Your profile has been updated.</p>
                </div>
              </div>
            </Animate>
          </div>

          {/* Card reveal */}
          <div>
            <p className="text-[0.75rem] text-muted-foreground font-mono mb-3">Card Reveal</p>
            <Animate key={`card-${mountKey}`} preset="scaleInBounce" duration={0.6}>
              <div className="p-5 rounded-xl border-2 border-primary bg-card text-center">
                <span className="text-[2rem]">🎉</span>
                <p className="text-[0.9375rem] mt-2">Achievement Unlocked!</p>
                <p className="text-[0.75rem] text-muted-foreground mt-1">You completed all tasks</p>
              </div>
            </Animate>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
