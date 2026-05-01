import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Bookmark, Check, ShoppingCart, Send, Bell, Trash2, Download, Loader2, Star, Copy, Plus } from "lucide-react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem]"><motion.span animate={liked ? { scale: [1, 1.5, 0.8, 1.2, 1], rotate: [0, -15, 15, -5, 0] } : { scale: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}><Heart className={`w-4.5 h-4.5 transition-colors ${liked ? "text-destructive fill-destructive" : "text-muted-foreground"}`} /></motion.span><span>{liked ? "Liked" : "Like"}</span></button>;
}

export function BookmarkButton() {
  const [saved, setSaved] = useState(false);
  return <button onClick={() => setSaved(!saved)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem]"><motion.span animate={saved ? { y: [0, -8, 0], scale: [1, 1.2, 1] } : { y: 0, scale: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}><Bookmark className={`w-4.5 h-4.5 transition-colors ${saved ? "text-warning fill-warning" : "text-muted-foreground"}`} /></motion.span><span>{saved ? "Saved" : "Save"}</span></button>;
}

export function AddToCartButton() {
  const [added, setAdded] = useState(false);
  return <button onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer text-[0.8125rem] ${added ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground hover:opacity-90"}`}><motion.span animate={added ? { rotate: [0, -30, 0], scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>{added ? <Check className="w-4.5 h-4.5" /> : <ShoppingCart className="w-4.5 h-4.5" />}</motion.span><span>{added ? "Added!" : "Add to Cart"}</span></button>;
}

export function SendButton() {
  const [sent, setSent] = useState(false);
  return <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-info text-info-foreground hover:opacity-90 transition-all cursor-pointer text-[0.8125rem]"><motion.span animate={sent ? { x: [0, 30], opacity: [1, 0] } : { x: 0, opacity: 1 }} transition={{ duration: 0.3 }}><Send className="w-4 h-4" /></motion.span><span>{sent ? "Sent!" : "Send"}</span></button>;
}

export function NotifyButton() {
  const [active, setActive] = useState(false);
  return <button onClick={() => { setActive(true); setTimeout(() => setActive(false), 1000); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem] relative"><motion.span animate={active ? { rotate: [0, 15, -15, 12, -12, 8, -8, 0], scale: [1, 1.15, 1.15, 1.1, 1.1, 1.05, 1.05, 1] } : {}} transition={{ duration: 0.6 }}><Bell className="w-4.5 h-4.5" /></motion.span><span>Notify</span>{active && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />}</button>;
}

export function DeleteButton() {
  const [deleting, setDeleting] = useState(false);
  return <button onClick={() => { setDeleting(true); setTimeout(() => setDeleting(false), 1500); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-[0.8125rem]"><motion.span animate={deleting ? { rotate: [0, -20, 20, -20, 0], y: [0, -2, 0] } : {}} transition={{ duration: 0.5 }}><Trash2 className="w-4 h-4" /></motion.span><span>{deleting ? "Deleting..." : "Delete"}</span></button>;
}

export function DownloadButton() {
  const [downloading, setDownloading] = useState(false);
  return <button onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 2000); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer text-[0.8125rem]"><motion.span animate={downloading ? { y: [0, 3, 0] } : {}} transition={{ duration: 0.5, repeat: downloading ? Infinity : 0 }}>{downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}</motion.span><span>{downloading ? "Downloading..." : "Download"}</span></button>;
}

export function StarRatingButton() {
  const [rating, setRating] = useState(0);
  return <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((i) => <motion.button key={i} onClick={() => setRating(i === rating ? 0 : i)} whileTap={{ scale: 0.75 }} animate={i <= rating ? { scale: [1, 1.4, 1], rotate: [0, -20, 0] } : { scale: 1 }} transition={{ duration: 0.3, delay: i <= rating ? (i - 1) * 0.06 : 0 }} className="p-1 cursor-pointer"><Star className={`w-6 h-6 transition-colors ${i <= rating ? "text-warning fill-warning" : "text-muted-foreground/40"}`} /></motion.button>)}</div>;
}

export function CopyButton() {
  const [copied, setCopied] = useState(false);
  return <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem]"><motion.span animate={copied ? { scale: [0, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3, type: "spring", stiffness: 300 }}>{copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}</motion.span><span>{copied ? "Copied!" : "Copy"}</span></button>;
}

export function PlusCounter() {
  const [count, setCount] = useState(0);
  return <div className="inline-flex items-center gap-3"><motion.button whileTap={{ scale: 0.85, rotate: -90 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} onClick={() => setCount((c) => c + 1)} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer"><Plus className="w-5 h-5" /></motion.button><motion.span key={count} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[1.25rem] w-8 text-center">{count}</motion.span></div>;
}
