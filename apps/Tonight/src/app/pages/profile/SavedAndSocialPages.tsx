/* Profile pages: SavedPlaces, Refer, Friends, TierBenefits */
import { useState } from "react";
import { Card } from "../../components/ds/Card";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Input } from "../../components/ds/Input";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../../components/ds/Modal";
import { DSBadge } from "../../components/ds/Badge";
import {
  Gift,
  Star,
  Copy,
  Share2,
  X,
  Trash2,
  ExternalLink,
  Check,
  ArrowUpRight,
  UserPlus,
  Sparkles,
  AtSign,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  PageHeader,
  fmtR,
  TierMedalSvg,
} from "./profileHelpers";

export function SavedPlacesPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const [confirmModal, setConfirmModal] = useState<
    number | null
  >(null);
  const savedRestaurants = [
    {
      id: 1,
      name: "Sakura Omakase",
      cuisine: "Japanese",
      address: "142 W 49th St",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Trattoria Moderna",
      cuisine: "Italian",
      address: "88 Greenwich Ave",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Siam Garden",
      cuisine: "Thai",
      address: "321 E 12th St",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200&h=200&fit=crop",
    },
    {
      id: 4,
      name: "The Ember Room",
      cuisine: "Steakhouse",
      address: "55 Irving Pl",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop",
    },
    {
      id: 5,
      name: "Verde Kitchen",
      cuisine: "Healthy",
      address: "200 Lafayette St",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",
    },
  ];
  return (
    <>
      <div className="pb-8">
        <PageHeader title="Saved Places" onBack={onBack} />
        <div className="space-y-3">
          {savedRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <ImageWithFallback
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Text
                  className="text-[0.8125rem]"
                  style={{ fontWeight: 600 }}
                >
                  {restaurant.name}
                </Text>
                <Text className="text-muted-foreground text-[0.6875rem]">
                  {restaurant.cuisine} · {restaurant.address}
                </Text>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <Text
                    className="text-[0.6875rem]"
                    style={{ fontWeight: 500 }}
                  >
                    {fmtR(restaurant.rating)}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-background/50 transition text-primary">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setConfirmModal(restaurant.id)}
                  className="p-1.5 rounded-lg hover:bg-background/50 transition text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={confirmModal !== null}
        onClose={() => setConfirmModal(null)}
        size="sm"
      >
        <ModalHeader>Remove Saved Place</ModalHeader>
        <ModalBody>
          <Text className="text-[0.8125rem] text-muted-foreground">
            Are you sure you want to remove this restaurant from
            your saved places?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setConfirmModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => setConfirmModal(null)}
          >
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export function ReferPage({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText("ALEX2024").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="pb-8">
      <PageHeader title="Refer a Friend" onBack={onBack} />
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
          <Gift className="w-8 h-8 text-success" />
        </div>
        <Heading level={4}>Share the Love</Heading>
        <Text className="text-muted-foreground text-[0.8125rem] mt-1">
          Give $10, Get $10. Share your code and you both earn
          rewards when they place their first order.
        </Text>
      </div>
      <div className="p-4 rounded-xl bg-secondary text-center">
        <Text className="text-muted-foreground text-[0.6875rem] mb-1">
          Your Referral Code
        </Text>
        <div className="flex items-center justify-center gap-3">
          <Text
            className="text-[1.5rem] tracking-[0.3em]"
            style={{ fontWeight: 700 }}
          >
            ALEX2024
          </Text>
          <button
            onClick={copyCode}
            className="p-1.5 rounded-lg hover:bg-background transition"
          >
            {copied ? (
              <Check className="w-5 h-5 text-success" />
            ) : (
              <Copy className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-secondary text-center mt-3">
        <Text className="text-muted-foreground text-[0.6875rem] mb-2">
          Your Referral QR
        </Text>
        <div className="flex justify-center">
          <div className="p-3 rounded-xl bg-white inline-block">
            <QRCodeSVG
              value="catchtable://refer/ALEX2024"
              size={160}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>
        <Text className="text-muted-foreground text-[0.6875rem] mt-2">
          Have friends scan this during sign-up
        </Text>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Referred", value: "5" },
          { label: "Earned", value: "$50", highlight: true },
          { label: "Pending", value: "3" },
        ].map((s) => (
          <Card
            key={s.label}
            variant="default"
            padding="sm"
            radius="lg"
            className="text-center"
          >
            <Text
              className={`text-[1.125rem] ${s.highlight ? "text-success" : ""}`}
              style={{ fontWeight: 700 }}
            >
              {s.value}
            </Text>
            <Text className="text-muted-foreground text-[0.6875rem]">
              {s.label}
            </Text>
          </Card>
        ))}
      </div>
      <Button
        variant="primary"
        fullWidth
        radius="full"
        leftIcon={<Share2 className="w-4 h-4" />}
        onClick={onBack}
        className="mt-5"
      >
        Share Invite Link
      </Button>
    </div>
  );
}

interface Contact {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  initials: string;
  color: string;
}

export function FriendsPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<
    string | null
  >(null);
  const [newContact, setNewContact] = useState({
    name: "",
    username: "",
    phone: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Kim",
      username: "sarahkim",
      initials: "SK",
      color: "#EC4899",
    },
    {
      id: "2",
      name: "Marcus Johnson",
      username: "marcusj",
      initials: "MJ",
      color: "#3B82F6",
    },
    {
      id: "3",
      name: "Emma Chen",
      username: "emmachen",
      initials: "EC",
      color: "#10B981",
    },
    {
      id: "4",
      name: "David Park",
      phone: "+1 (555) 567-8901",
      initials: "DP",
      color: "#F59E0B",
    },
    {
      id: "5",
      name: "Olivia Tran",
      username: "oliviat",
      initials: "OT",
      color: "#8B5CF6",
    },
    {
      id: "6",
      name: "James Lee",
      username: "jameslee",
      initials: "JL",
      color: "#06B6D4",
    },
    {
      id: "7",
      name: "Maya Patel",
      username: "mayap",
      initials: "MP",
      color: "#EF4444",
    },
    {
      id: "8",
      name: "Ryan O'Brien",
      phone: "+1 (555) 789-0123",
      initials: "RO",
      color: "#14B8A6",
    },
  ]);
  const handleAddContact = () => {
    if (!newContact.name) return;
    const initials = newContact.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const colors = [
      "#EC4899",
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#06B6D4",
      "#EF4444",
      "#14B8A6",
    ];
    setContacts([
      ...contacts,
      {
        id: String(Date.now()),
        name: newContact.name,
        username: newContact.username || undefined,
        phone: newContact.phone || undefined,
        initials,
        color:
          colors[Math.floor(Math.random() * colors.length)],
      },
    ]);
    setNewContact({ name: "", username: "", phone: "" });
    setShowAddForm(false);
  };
  return (
    <>
      <div className="pb-8">
        <PageHeader
          title="Friends & Contacts"
          onBack={onBack}
        />
        <AnimatePresence mode="wait" initial={false}>
          {showAddForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-4 rounded-3xl overflow-hidden border border-border bg-card shadow-sm"
            >
              {/* Cute gradient header */}
              <div
                className="relative px-5 pt-5 pb-12"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--primary) 22%, transparent), color-mix(in oklab, var(--info) 18%, transparent))",
                }}
              >
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewContact({
                      name: "",
                      username: "",
                      phone: "",
                    });
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -4, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <Sparkles
                      className="w-5 h-5"
                      style={{ color: "var(--primary)" }}
                    />
                  </motion.div>
                  <Text
                    className="text-[1.0625rem]"
                    style={{ fontWeight: 700 }}
                  >
                    New Friend
                  </Text>
                </div>
                <Text className="text-muted-foreground text-[0.8125rem] mt-1">
                  Add someone to share dining moments with
                </Text>
              </div>

              {/* Floating avatar preview */}
              <div className="relative px-5">
                <motion.div
                  layout
                  className="absolute -top-9 left-5 w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-card"
                  style={{
                    background: newContact.name
                      ? "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 60%, var(--info)))"
                      : "linear-gradient(135deg, var(--muted), var(--secondary))",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                  }}
                >
                  {newContact.name ? (
                    newContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  ) : (
                    <UserPlus className="w-7 h-7 text-muted-foreground" />
                  )}
                </motion.div>
              </div>

              {/* Form fields */}
              <div className="px-5 pt-12 pb-5 space-y-3">
                {[
                  {
                    key: "username",
                    placeholder: "username",
                    icon: AtSign,
                    label: "Username",
                  },
                ].map((field) => {
                  const Icon = field.icon;
                  const value =
                    newContact[
                      field.key as "name" | "username" | "phone"
                    ];
                  return (
                    <div key={field.key} className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder={
                          field.placeholder +
                          (field.required ? " *" : "")
                        }
                        value={value}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            [field.key]: e.target.value,
                          })
                        }
                        fullWidth
                        className="!pl-10 !rounded-2xl"
                      />
                    </div>
                  );
                })}
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="primary"
                    fullWidth
                    radius="full"
                    leftIcon={<UserPlus className="w-4 h-4" />}
                    onClick={handleAddContact}
                    disabled={!newContact.name}
                    className="mt-1"
                  >
                    Add to Contacts
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="w-full mb-4 p-4 rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition flex items-center gap-3 group"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center group-hover:scale-110 transition"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 60%, var(--info)))",
                }}
              >
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <Text
                  className="text-[0.9375rem] text-primary"
                  style={{ fontWeight: 700 }}
                >
                  Add a Friend
                </Text>
                <Text className="text-muted-foreground text-[0.75rem]">
                  Build your dining circle
                </Text>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
        <Text className="text-[0.6875rem] text-muted-foreground mb-3">
          {contacts.length} contacts
        </Text>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-[0.8125rem]"
                style={{
                  backgroundColor: contact.color,
                  fontWeight: 600,
                }}
              >
                {contact.initials}
              </div>
              <div className="flex-1 min-w-0">
                <Text
                  className="text-[0.8125rem]"
                  style={{ fontWeight: 600 }}
                >
                  {contact.name}
                </Text>
                <Text className="text-muted-foreground text-[0.6875rem]">
                  {contact.username
                    ? `@${contact.username}`
                    : contact.phone}
                </Text>
              </div>
              <button
                onClick={() => setConfirmModal(contact.id)}
                className="p-1.5 rounded-lg hover:bg-background/50 transition text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={confirmModal !== null}
        onClose={() => setConfirmModal(null)}
        size="sm"
      >
        <ModalHeader>Remove Contact</ModalHeader>
        <ModalBody>
          <Text className="text-[0.8125rem] text-muted-foreground">
            Are you sure you want to remove this contact?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setConfirmModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirmModal) {
                setContacts(
                  contacts.filter((c) => c.id !== confirmModal),
                );
                setConfirmModal(null);
              }
            }}
          >
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export function TierBenefitsPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const tiers = [
    {
      name: "Silver",
      icon: "silver" as const,
      benefits: [
        "1% cashback on orders",
        "Birthday reward",
        "Basic support",
      ],
    },
    {
      name: "Gold",
      icon: "gold" as const,
      current: true,
      benefits: [
        "3% cashback on orders",
        "Free delivery on orders $25+",
        "Priority support",
        "Early access to new restaurants",
      ],
    },
    {
      name: "Platinum",
      icon: "platinum" as const,
      benefits: [
        "5% cashback on orders",
        "Free delivery on all orders",
        "VIP support",
        "Exclusive events",
        "Complimentary appetizer monthly",
      ],
    },
    {
      name: "Diamond",
      icon: "diamond" as const,
      benefits: [
        "8% cashback on orders",
        "Free delivery always",
        "Dedicated concierge",
        "Chef's table access",
        "Annual dining credit $200",
      ],
    },
  ];
  return (
    <div className="pb-8">
      <PageHeader title="Tier Benefits" onBack={onBack} />
      <div className="space-y-4">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border-2 ${tier.current ? "border-primary bg-primary/5" : "border-border bg-card"}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <TierMedalSvg tier={tier.icon} size={28} />
              <Text
                className={`text-[1rem] ${tier.current ? "text-primary" : ""}`}
                style={{ fontWeight: 700 }}
              >
                {tier.name}
              </Text>
              {tier.current && (
                <DSBadge
                  variant="outline"
                  size="sm"
                  className="!border-primary !text-primary"
                >
                  Current
                </DSBadge>
              )}
            </div>
            <div className="space-y-2">
              {tier.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <Text className="text-[0.8125rem] text-muted-foreground">
                    {benefit}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}