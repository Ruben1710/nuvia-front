'use client';

import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  className?: string;
}

export function HelpTooltip({ text, className = '' }: HelpTooltipProps) {
  return (
    <div className={`relative inline-block group/tooltip ${className}`}>
      <button
        type="button"
        className="w-5 h-5 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center hover:bg-gray-600 transition-colors"
        aria-label="Info"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {/* Hover Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 sm:w-96 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none">
        <div className="text-white text-sm whitespace-pre-line leading-relaxed">
          {text}
        </div>
        {/* Arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}

