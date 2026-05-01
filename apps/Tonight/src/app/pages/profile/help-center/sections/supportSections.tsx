import {
  Accessibility,
  AlertTriangle,
  BookOpen,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  User,
  Volume2,
} from "lucide-react";
import { Card } from "../../../../components/ds/Card";
import { Text } from "../../../../components/ds/Text";
import { InlineLink, Step, Tip } from "../HelpCenterPrimitives";
import type { Section } from "../types";

export interface SupportSectionsArgs {
  onContactSupport?: () => void;
}

export function createSupportSections({ onContactSupport }: SupportSectionsArgs): Section[] {
  return [
    {
      id: "profile",
      title: "Profile & settings",
      icon: User,
      summary: "Your name, theme, rewards, and app settings.",
      keywords: "profile settings theme rewards tier balance friends",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["signin", "help-usage"],
      render: () => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The <b>Profile</b> tab is your personal space. From here you can edit your name, see your rewards balance, change the look of the app, and open Settings.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Tap your name at the top to edit your profile.</Step>
            <Step n={2}>Use the <b>Appearance</b> buttons to change colors or switch to dark mode.</Step>
            <Step n={3}>Open <b>Settings</b> for account, privacy, language, and sound options.</Step>
            <Step n={4}>Tap <b>Help &amp; Guide</b> any time to come back here.</Step>
          </div>
          <Tip tone="info" icon={Sparkles}>
            Earn points every time you dine or refer a friend — points unlock higher reward tiers.
          </Tip>
          <Text className="text-[0.8125rem] text-muted-foreground">Need to sign out? Open <b>Settings</b> and scroll to the bottom.</Text>
        </div>
      ),
    },
    {
      id: "accessibility",
      title: "Accessibility & comfort",
      icon: Accessibility,
      summary: "Larger text, read-aloud, and colour themes.",
      keywords: "accessibility large text read aloud voice contrast theme dark",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["profile", "help-usage"],
      render: () => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Make the app comfortable for you. Whether you need bigger letters, spoken text, or a dark screen, we have options.
          </Text>
          <div className="space-y-3">
            <Step n={1}><b>Larger text</b> — use the <i>A+</i> button at the top of this guide to make everything bigger.</Step>
            <Step n={2}><b>Read aloud</b> — tap the speaker icon at the top of any section and the app will read it to you.</Step>
            <Step n={3}><b>Dark mode / themes</b> — change the colour in Profile → Appearance.</Step>
            <Step n={4}><b>Language</b> — go to Profile → Settings → Language.</Step>
          </div>
          <Tip tone="success" icon={Volume2}>
            Read-aloud needs a moment to start on some phones. If nothing happens, check that your phone's volume is on.
          </Tip>
        </div>
      ),
    },
    {
      id: "help-usage",
      title: "How to use this guide",
      icon: BookOpen,
      summary: "Search, links, and quick navigation.",
      keywords: "how use guide help search hyperlink navigation",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop",
      readMins: 1,
      related: ["getting-started", "accessibility"],
      render: (jumpTo) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">Think of this page as a small book with clickable pages.</Text>
          <div className="space-y-3">
            <Step n={1}>Use the <b>Search</b> box at the top to jump to any topic.</Step>
            <Step n={2}>Every underlined word is a <b>link</b>. Tap it to go to that topic. Try <InlineLink to="qrpay" onJump={jumpTo}>QR Pay</InlineLink>!</Step>
            <Step n={3}>Scroll down — each topic has steps and pictures.</Step>
            <Step n={4}>Tap <b>"Was this helpful?"</b> at the end of a topic to tell us what to improve.</Step>
            <Step n={5}>Still stuck? Tap the floating chat bubble to <InlineLink to="contact" onJump={jumpTo}>talk to us</InlineLink> right now.</Step>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshoot",
      title: "When something goes wrong",
      icon: AlertTriangle,
      summary: "Simple fixes for common problems.",
      keywords: "problem error bug fix help support slow crash",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop",
      readMins: 3,
      related: ["contact", "qrpay", "signin"],
      render: (jumpTo) => (
        <div className="space-y-4">
          <div className="space-y-3">
            <Step n={1}><b>I can't see anything / the page is blank.</b> Pull down to refresh, or close the app and open it again.</Step>
            <Step n={2}><b>My heart isn't turning red.</b> You must <InlineLink to="signin" onJump={jumpTo}>sign in</InlineLink> first to save items.</Step>
            <Step n={3}><b>Booking won't go through.</b> Check your phone number has the right country code.</Step>
            <Step n={4}><b>QR code won't scan.</b> Make sure there is enough light and hold the camera steady.</Step>
            <Step n={5}><b>I forgot my password.</b> On the login screen, tap <b>Forgot password</b>.</Step>
          </div>
          <Tip tone="info" icon={MessageCircle}>
            Still stuck? Jump to <InlineLink to="contact" onJump={jumpTo}>Contact support</InlineLink> and we'll help — or tap the chat bubble at the bottom.
          </Tip>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact support",
      icon: MessageCircle,
      summary: "Chat, email, or call us.",
      keywords: "contact help support email phone chat live agent",
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1200&h=600&fit=crop",
      readMins: 1,
      related: ["troubleshoot", "help-usage"],
      render: () => (
        <div className="space-y-3">
          <Text className="text-[0.9375rem] leading-relaxed">
            Our team replies within 24 hours. Pick whichever is easiest for you.
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onContactSupport?.()}
              className="text-left rounded-xl p-4 border border-primary bg-primary/5 hover:bg-primary/10 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 20%, transparent)" }}>
                  <MessageCircle className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <Text style={{ fontWeight: 600 }}>Live chat</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">Fastest · now</Text>
                </div>
              </div>
            </button>
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--info, var(--primary)) 15%, transparent)" }}>
                  <Mail className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <Text style={{ fontWeight: 600 }}>Email</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">help@catchtable.app</Text>
                </div>
              </div>
            </Card>
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--success) 15%, transparent)" }}>
                  <Phone className="w-5 h-5" style={{ color: "var(--success)" }} />
                </div>
                <div>
                  <Text style={{ fontWeight: 600 }}>Phone</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">1-800-CATCH-TB</Text>
                </div>
              </div>
            </Card>
          </div>
          <Text className="text-[0.8125rem] text-muted-foreground">Mon–Sun · 08:00–22:00 local time</Text>
        </div>
      ),
    },
  ];
}
