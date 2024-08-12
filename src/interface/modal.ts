export interface AlertProps {
  icon: string;
  width: number;
  height: number;
  content: string;
  alt: string;
  onClose: () => void;
  buttonText: string;
}