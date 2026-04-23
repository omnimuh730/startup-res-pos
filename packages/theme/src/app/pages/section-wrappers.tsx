import { CardsSection } from "../components/sections/cards-section";
import { RibbonSection } from "../components/sections/ribbon-section";
import { ExtrasSection } from "../components/sections/extras-section";

const IMAGES = {
  card1: "https://images.unsplash.com/photo-1775697168702-4245e0a07bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhYmluJTIwcmV0cmVhdCUyMGNvenl8ZW58MXx8fHwxNzc2MTMxNTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  card2: "https://images.unsplash.com/photo-1625461291092-13d0c45608b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3NjEzMTUzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  card3: "https://images.unsplash.com/photo-1772398539093-fc7b4a6b1bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwdmlsbGElMjBzdW5zZXR8ZW58MXx8fHwxNzc2MTMxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

const AVATAR_URL = "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NjAzODIwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function CardsSectionPage() {
  return <CardsSection images={IMAGES} />;
}

export function RibbonSectionPage() {
  return <RibbonSection images={IMAGES} />;
}

export function ExtrasSectionPage() {
  return <ExtrasSection avatarUrl={AVATAR_URL} />;
}
