import * as React from "react";
import { StepperCounter as BaseStepperCounter } from "../components/FormExtras";

export type SliderProps = React.ComponentProps<typeof BaseStepperCounter>;

export function Slider(props: SliderProps) {
  return <BaseStepperCounter value={4} {...props} />;
}
