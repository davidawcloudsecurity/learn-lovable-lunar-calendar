         import { useState } from 'react';
import { MoreVertical, Settings, Info } from 'lucide-react';
import HorseMascot from './HorseMascot';
import { getYearZodiac, getYearStemBranch } from '@/lib/chinese-calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { ProfileDialog } from './ProfileDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ViewType = 'hourly' | 'daily' | 'monthly' | 'yearly';

interface CalendarHeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedDate: Date;
}

const VIEWS: { key: ViewType; label: string; cn: string }[] = [
  { key: 'hourly', label: 'Hour', cn: '时' },
  { key: 'daily', label: 'Day', cn: '日' },
  { key: 'monthly', label: 'Month', cn: '月' },
  { key: 'yearly', label: 'Year', cn: '年' },
];

const CalendarHeader = ({ view, onViewChange, selectedDate }: CalendarHeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const year = selectedDate.getFullYear();
  const zodiac = getYearZodiac(year);
  const stemBranch = getYearStemBranch(year);

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      {/* Title row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HorseMascot small />
          <div>
            <h1 className="text-xl font-bold leading-tight">Chinese Zodiac Calendar</h1>
            <p className="text-sm text-muted-foreground">
              {year} · {stemBranch.full}年 · {stemBranch.element}{zodiac.cn}年 · {zodiac.emoji} {zodiac.name}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-muted rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Calendar Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>BaZi Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAboutOpen(true)}>
              <Info className="mr-2 h-4 w-4" />
              <span>About</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>About Lunar Calendar</DialogTitle>
            <DialogDescription>
              A personalized BaZi-aware Chinese Zodiac calendar focused on work risk analysis and behavioral patterns.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-2 py-2">
            <p>Version 1.0.0</p>
            <p>Calculates daily interactions (Clash, Punishment, Harmony) against your unique 4-pillar chart.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* View tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {VIEWS.map(v => (
          <button
            key={v.key}
            onClick={() => onViewChange(v.key)}
            className={`view-tab flex-1 text-center ${view === v.key ? 'view-tab-active' : 'view-tab-inactive'
              }`}
          >
            <span className="block text-sm">{v.cn}</span>
            <span className="block text-xs opacity-80">{v.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default CalendarHeader;
