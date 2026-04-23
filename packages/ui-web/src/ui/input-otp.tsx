import * as React from "react";
import { NumberInput as BaseNumberInput } from "../components/FormExtras";

export type InputOtpProps = React.ComponentProps<typeof BaseNumberInput>;

export function InputOtp(props: InputOtpProps) {
  return <BaseNumberInput value={123456} {...props} />;
}
