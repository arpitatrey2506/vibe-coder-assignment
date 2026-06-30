import { useState } from "react";

interface AvatarProps {
  src: string;
  username: string;
  className?: string;
}

export function Avatar({ src, username, className = "" }: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const getInitial = () => {
    const safeName = username || "";
    const clean = safeName.replace(/[^a-zA-Z0-9]/g, "");
    return clean.charAt(0).toUpperCase() || (safeName.charAt(0).toUpperCase() || "?");
  };

  const getGradient = () => {
    const safeName = username || "user";
    const chars = safeName.split("").map((c) => c.charCodeAt(0));
    const sum = chars.reduce((a, b) => a + b, 0);
    const gradients = [
      "from-purple-600 to-pink-500",
      "from-blue-600 to-indigo-600",
      "from-emerald-600 to-teal-500",
      "from-orange-500 to-amber-500",
      "from-rose-500 to-pink-600",
    ];
    return gradients[sum % gradients.length];
  };

  if (hasError || !src) {
    return (
      <div 
        className={`rounded-full bg-gradient-to-br ${getGradient()} text-white font-extrabold flex items-center justify-center select-none shadow-inner shrink-0 ${className}`}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
      >
        <span>{getInitial()}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`@${username || "user"}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  );
}
