import { CheckCircle2, Heart, Home, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "../../../../components/ds/Card";
import { Text } from "../../../../components/ds/Text";
import { InlineLink, Step, Tip } from "../HelpCenterPrimitives";
import type { Section } from "../types";

export function createFoundationsSections(): Section[] {
  return [
    {
      id: "getting-started",
      title: "Getting started",
      icon: Sparkles,
      summary: "A friendly first look at CatchTable.",
      keywords: "start begin intro first time tutorial how",
      image: "https://images.unsplash.com/photo-1723744910051-da35a92321af?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["discover", "signin", "book"],
      video: { title: "30-second tour", length: "0:32" },
      render: (jumpTo) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Welcome! CatchTable helps you <b>find</b> great restaurants, <b>book</b> a table, <b>pay</b> with your phone, and <b>save</b> the places you love. You can look around without signing in. You only need an account when you want to save, book, or pay.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Open the app. The first thing you see is the <InlineLink to="discover" onJump={jumpTo}>Discover</InlineLink> page.</Step>
            <Step n={2}>At the bottom of the screen are four big buttons: Discover, Wishlist, Dining, and Profile. In the middle is a round QR button.</Step>
            <Step n={3}>Tap any card or picture to see more about a restaurant or a food.</Step>
            <Step n={4}>When you're ready, tap the heart to save a place, or tap <b>Book</b> to reserve a table.</Step>
          </div>
          <Tip>
            New here? Try <InlineLink to="discover" onJump={jumpTo}>Discover</InlineLink> first to browse, then learn how to <InlineLink to="book" onJump={jumpTo}>book a table</InlineLink>.
          </Tip>
        </div>
      ),
    },
    {
      id: "signin",
      title: "Sign in & accounts",
      icon: LogIn,
      summary: "Why you sometimes need to sign in.",
      keywords: "login register sign up account profile password",
      image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["saved", "book", "profile"],
      render: (jumpTo) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Browsing <InlineLink to="discover" onJump={jumpTo}>Discover</InlineLink> is always free — no sign-in required. You'll be asked to sign in <b>only</b> when you use features that need your personal data.
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-2 mb-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--success)" }} /><Text style={{ fontWeight: 600 }}>No sign-in needed</Text></div>
              <ul className="text-[0.875rem] text-muted-foreground space-y-1 list-disc pl-4">
                <li>Browsing restaurants</li>
                <li>Searching food or places</li>
                <li>Reading menus &amp; reviews</li>
              </ul>
            </Card>
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-2 mb-1.5"><LogIn className="w-4 h-4" style={{ color: "var(--primary)" }} /><Text style={{ fontWeight: 600 }}>Sign-in required</Text></div>
              <ul className="text-[0.875rem] text-muted-foreground space-y-1 list-disc pl-4">
                <li><InlineLink to="saved" onJump={jumpTo}>Saving to your Wishlist</InlineLink></li>
                <li><InlineLink to="book" onJump={jumpTo}>Booking a table</InlineLink></li>
                <li><InlineLink to="qrpay" onJump={jumpTo}>QR Pay</InlineLink></li>
                <li>Dining &amp; Profile tabs</li>
              </ul>
            </Card>
          </div>
          <Tip tone="info" icon={ShieldCheck}>
            When a feature needs you to sign in, a small pop-up appears. Tap <b>Sign in</b> to continue, or <b>Not now</b> to go back.
          </Tip>
        </div>
      ),
    },
    {
      id: "discover",
      title: "Discover page",
      icon: Home,
      summary: "Find restaurants, foods, and promotions.",
      keywords: "discover home search banners categories monthly best",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=600&fit=crop",
      readMins: 3,
      related: ["saved", "book", "signin"],
      video: { title: "Browsing Discover", length: "1:05" },
      render: (jumpTo) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The <b>Discover</b> page is the front door of the app. Scroll up and down to see featured places, cities, food types, monthly best picks, and more.
          </Text>
          <div className="space-y-3">
            <Step n={1}><b>Search bar</b> at the top — type any restaurant, food, or city name and tap the result.</Step>
            <Step n={2}><b>Big picture banners</b> — drag left or right to see more. Tap the picture to open that collection. Tap <b>View All</b> in the corner to see every banner in a big gallery.</Step>
            <Step n={3}><b>Round category icons</b> — like "Korean", "Italian", "Dessert". Tap any one to see restaurants in that category.</Step>
            <Step n={4}><b>Nearby Me</b> &amp; <b>Local Favourite</b> — these use your location, so they need <InlineLink to="signin" onJump={jumpTo}>sign in</InlineLink>.</Step>
            <Step n={5}>Tap any restaurant card to see the menu, photos, reviews, and a Book button.</Step>
          </div>
          <Tip>
            See a place you like? Tap the little <Heart className="inline w-3.5 h-3.5 text-red-500" fill="currentColor" /> on the picture to <InlineLink to="saved" onJump={jumpTo}>save it</InlineLink> for later.
          </Tip>
        </div>
      ),
    },
    {
      id: "wishlist",
      title: "Wishlist",
      icon: Heart,
      summary: "Keep saved restaurants and foods together.",
      keywords: "wishlist saved favorites heart bookmark",
      image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["discover", "signin"],
      render: () => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The <b>Wishlist</b> tab keeps your saved restaurants and foods in one place.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Open the Wishlist tab from the bottom navigation.</Step>
            <Step n={2}>Tap a collection to see saved places.</Step>
            <Step n={3}>Tap any saved restaurant to open it again.</Step>
            <Step n={4}>Tap the heart again when you want to remove something.</Step>
          </div>
          <Tip icon={Heart}>
            Wishlist is private to your account, so it is available after sign-in.
          </Tip>
        </div>
      ),
    },
    {
      id: "saved",
      title: "Saving to your Wishlist",
      icon: Heart,
      summary: "Keep your favourites in one place.",
      keywords: "save favorite favourite heart bookmark list wishlist",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["signin", "discover"],
      render: (jumpTo) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Tap the little heart on any restaurant or food picture to add it to your <b>Wishlist</b>. A red heart means it is saved. Tap again to remove.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Tap the heart icon on a card. If you aren't signed in, a pop-up will ask you to <InlineLink to="signin" onJump={jumpTo}>sign in first</InlineLink>.</Step>
            <Step n={2}>Open your list from the <b>Wishlist</b> button in the bottom navigation.</Step>
            <Step n={3}>Open a collection to browse saved restaurants and foods.</Step>
            <Step n={4}>Tap any saved item to open it again, or tap its heart to remove it from the list.</Step>
          </div>
          <Tip icon={Heart}>
            Saving is free and private — only you can see your Wishlist.
          </Tip>
        </div>
      ),
    },
  ];
}
