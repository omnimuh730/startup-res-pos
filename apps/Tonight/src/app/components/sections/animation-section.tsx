import { useState } from "react";
import { SectionWrapper } from "../section-wrapper";
import { AnimationSectionContent } from "./animation-section/content";

export function AnimationSection() {
  const [mountKey, setMountKey] = useState(0);
  const [staggerKey, setStaggerKey] = useState(0);
  const replay = () => setMountKey((k) => k + 1);
  const replayStagger = () => setStaggerKey((k) => k + 1);

  return (
    <SectionWrapper id="animation-ds" title="Animations" description="Reusable micro-animation component with 18+ presets. Supports mount, hover, tap, and in-view triggers with stagger support — plus icon micro-interactions for buttons.">
      <AnimationSectionContent mountKey={mountKey} staggerKey={staggerKey} replay={replay} replayStagger={replayStagger} />
    </SectionWrapper>
  );
}
