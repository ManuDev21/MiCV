import { ReactNode } from 'react';
import MagneticButton from './MagneticButton';

interface NeonButtonProps {
  children: ReactNode;
  href?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'neu';
  className?: string;
  ariaLabel?: string;
}

export default function NeonButton(props: NeonButtonProps) {
  return <MagneticButton {...props} />;
}
