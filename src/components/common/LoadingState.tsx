import { Spinner } from "./Spinner";


interface LoadingStateProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LoadingState({ size = 'medium', className = '' }: LoadingStateProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner className={sizeClasses[size]} />
    </div>
  );
} 