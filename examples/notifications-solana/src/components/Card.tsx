import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-transparent rounded-lg border border-light-60 dark:border-dark-40 p-6 w-full ${className}`}>
      {children}
    </div>
  );
};