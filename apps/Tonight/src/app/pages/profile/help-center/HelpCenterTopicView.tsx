import { ArrowLeft, Clock3, MessageCircle, Play, Volume2 } from "lucide-react";
import { Card } from "../../../components/ds/Card";
import { Button } from "../../../components/ds/Button";
import { Text } from "../../../components/ds/Text";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { SectionHelpfulness } from "./HelpCenterPrimitives";
import type { Section } from "./types";

interface HelpCenterTopicViewProps {
  activeTopic: Section;
  sections: Section[];
  onJump: (id: string) => void;
  onSpeak: (text: string) => void;
  onFeedback: (id: string, v: "up" | "down") => void;
  onGoIndex: () => void;
  onContactSupport?: () => void;
}

export function HelpCenterTopicView({
  activeTopic,
  sections,
  onJump,
  onSpeak,
  onFeedback,
  onGoIndex,
  onContactSupport,
}: HelpCenterTopicViewProps) {
  return (
    <div className="space-y-7">
      <section id={`help-${activeTopic.id}`} className="scroll-mt-4">
        <div className="relative rounded-3xl overflow-hidden mb-3" style={{ aspectRatio: "3 / 1" }}>
          <ImageWithFallback src={activeTopic.image} alt={activeTopic.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)" }}
          />
          <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[0.6875rem]" style={{ fontWeight: 700, color: "var(--primary)" }}>
                <activeTopic.icon className="w-3 h-3" /> {activeTopic.title}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[0.6875rem]" style={{ fontWeight: 600 }}>
                <Clock3 className="w-3 h-3" /> {activeTopic.readMins} min read
              </span>
              {activeTopic.video && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[0.6875rem]" style={{ fontWeight: 600 }}>
                  <Play className="w-3 h-3" /> Video · {activeTopic.video.length}
                </span>
              )}
            </div>
            <h3 className="text-white mt-2 text-[1.25rem] sm:text-[1.375rem] leading-tight" style={{ fontWeight: 700 }}>
              {activeTopic.title}
            </h3>
            <p className="text-white/80 text-[0.8125rem] mt-0.5">{activeTopic.summary}</p>
          </div>
          <button
            onClick={() => onSpeak(`${activeTopic.title}. ${activeTopic.summary}`)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white cursor-pointer transition"
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <Card variant="default" padding="md" radius="lg">
          {activeTopic.render(onJump)}

          {activeTopic.video && (
            <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Play className="w-4 h-4" style={{ color: "var(--primary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>
                  {activeTopic.video.title}
                </Text>
                <Text className="text-muted-foreground text-[0.75rem]">
                  Video walkthrough · {activeTopic.video.length}
                </Text>
              </div>
              <Button variant="outline" size="sm" radius="full">Watch</Button>
            </div>
          )}

          {activeTopic.related.length > 0 && (
            <div className="mt-4">
              <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>
                Related
              </Text>
              <div className="flex flex-wrap gap-2">
                {activeTopic.related.map((relatedId) => {
                  const related = sections.find((x) => x.id === relatedId);
                  if (!related) return null;
                  return (
                    <button
                      key={relatedId}
                      onClick={() => onJump(relatedId)}
                      className="text-[0.8125rem] px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 transition cursor-pointer inline-flex items-center gap-1"
                    >
                      <related.icon className="w-3.5 h-3.5" /> {related.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <SectionHelpfulness sectionId={activeTopic.id} onFeedback={onFeedback} />
        </Card>
      </section>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="outline" radius="full" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={onGoIndex}>
          All topics
        </Button>
        <Button variant="primary" radius="full" leftIcon={<MessageCircle className="w-4 h-4" />} onClick={() => onContactSupport?.()}>
          Contact support
        </Button>
      </div>
    </div>
  );
}
