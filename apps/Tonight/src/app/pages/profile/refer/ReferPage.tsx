import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { PageHeader } from "../profileHelpers";
import { Gift, Copy, Check, Share2, QrCode } from "lucide-react";
import { Text } from "../../../components/ds/Text";
import { Card } from "../../../components/ds/Card";
import { Button } from "../../../components/ds/Button";
import { QRCodeSVG } from "qrcode.react";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
      
      <motion.div 
        className="px-5 pt-2"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariant} className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>
          <Text className="text-[26px] font-bold text-foreground leading-tight">Share the Love</Text>
          <Text className="text-muted-foreground text-[14px] mt-1.5 px-4">
            Give $10, Get $10. Share your code and you both earn rewards when they place their first order.
          </Text>
        </motion.div>

        {/* Shareable Assets */}
        <motion.div variants={itemVariant} className="space-y-3 mb-6">
          {/* Referral Code */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between shadow-sm">
            <div>
              <Text className="text-muted-foreground text-[12px] uppercase tracking-wider font-bold mb-0.5">
                Your Code
              </Text>
              <Text className="text-[20px] tracking-[0.15em] font-bold text-foreground">
                ALEX2024
              </Text>
            </div>
            <button
              onClick={copyCode}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                copied ? "bg-success/10 text-success" : "bg-secondary text-foreground hover:bg-border"
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* QR Code */}
          <div className="p-5 rounded-2xl border border-border bg-card text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <QrCode className="w-32 h-32" />
            </div>
            <Text className="text-muted-foreground text-[12px] uppercase tracking-wider font-bold mb-4 relative z-10">
              Scan to Sign Up
            </Text>
            <div className="flex justify-center relative z-10">
              <div className="p-3.5 rounded-xl bg-white shadow-sm border border-border/50 inline-block">
                <QRCodeSVG
                  value="catchtable://refer/ALEX2024"
                  size={140}
                  level="M"
                  includeMargin={false}
                  color="#222222"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariant} className="grid grid-cols-3 gap-2 mb-8">
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
              className="text-center border-border shadow-none bg-card"
            >
              <Text className={`text-[20px] font-bold ${s.highlight ? "text-success" : "text-foreground"}`}>
                {s.value}
              </Text>
              <Text className="text-muted-foreground text-[12px] font-medium mt-0.5">
                {s.label}
              </Text>
            </Card>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariant}>
          <Button
            variant="primary"
            fullWidth
            className="h-[52px] rounded-full text-[15px] font-bold shadow-[0_8px_24px_rgba(255,56,92,0.2)]"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={onBack}
          >
            Share Invite Link
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}