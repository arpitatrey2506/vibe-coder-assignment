interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
}

export function VerifiedBadge({ verified, className = "" }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <svg 
      className={`w-4 h-4 text-blue-400 fill-current inline-block align-middle ml-1.5 shrink-0 ${className}`} 
      viewBox="0 0 24 24" 
    >
      <title>Verified Creator</title>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}
