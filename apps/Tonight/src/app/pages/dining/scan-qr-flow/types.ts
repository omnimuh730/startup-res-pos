import type { BookingInfo, ScanStep } from "../scanQRData";

export interface ScanQRFlowProps {
  booking: BookingInfo;
  onClose: () => void;
  initialStep?: ScanStep;
  onCheckedIn?: () => void;
}
