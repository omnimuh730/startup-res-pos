import { useState } from "react";
import { PageHeader } from "../profileHelpers";
import { Gift } from "lucide-react";
import { Heading } from "../../../components/ds/Text";
import { Text } from "../../../components/ds/Text";
import { Copy, Check, Share2 } from "lucide-react";
import { Card } from "../../../components/ds/Card";
import { Button } from "../../../components/ds/Button";
import { QRCodeSVG } from "qrcode.react";

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