"use client";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export function Tooltip({ children, content, disabled }: TooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <span className="relative group/tooltip inline">
      {children}
      <span
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150
          bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap z-50
          pointer-events-none shadow-lg"
      >
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  );
}
