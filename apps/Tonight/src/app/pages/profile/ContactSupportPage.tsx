/* Contact Support — standalone page hosting the help chat + other contact options */
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";
import { Card } from "../../components/ds/Card";
import { Text, Heading } from "../../components/ds/Text";
import { HelpChatModal } from "./HelpChatModal";

export function ContactSupportPage({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[250] bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-3 max-w-3xl mx-auto w-full">
          <button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <Heading level={3}>Contact support</Heading>
            <Text className="text-muted-foreground text-[0.75rem]">Chat with us, email, or call — we reply fast</Text>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-5 space-y-5 pb-[75vh] sm:pb-40">
          {/* Other options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 14%, transparent)" }}>
                  <Mail className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <Text style={{ fontWeight: 700 }}>Email us</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">support@catchtable.app · reply in 24h</Text>
                </div>
              </div>
            </Card>
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--success) 14%, transparent)" }}>
                  <Phone className="w-5 h-5" style={{ color: "var(--success)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <Text style={{ fontWeight: 700 }}>Call a human</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">Mon–Sun · 9am – 10pm</Text>
                </div>
              </div>
            </Card>
          </div>

          <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}>
            <MessageCircle className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <Text className="text-[0.875rem]">The chat below is open. Type a question or pick a quick topic to get started.</Text>
          </div>
        </div>
      </div>

      {/* Chat as a bottom-anchored sheet that takes over most of the viewport */}
      <HelpChatModal
        open
        onClose={onBack}
        onJumpToSection={(id) => navigate(`/profile/help/${id}`)}
      />
    </div>
  );
}
