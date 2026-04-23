import * as React from "react";
import { Carousel as BaseCarousel } from "../components/NavigationDisplay";

export type CarouselProps = React.ComponentProps<typeof BaseCarousel>;

export function Carousel(props: CarouselProps) {
  return <BaseCarousel {...props} />;
}
