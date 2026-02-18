import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface BeginnerTooltipProps {
  content: string;
  children?: ReactNode;
  showIcon?: boolean;
}

export function BeginnerTooltip({ content, children, showIcon = true }: BeginnerTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted transition-colors">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
