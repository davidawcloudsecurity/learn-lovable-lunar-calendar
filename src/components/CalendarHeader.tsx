import { useState } from 'react';
import { MoreVertical, Settings, Info, Search, Clock, Calendar, CalendarDays, CalendarRange, Database, HelpCircle } from 'lucide-react';
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
import { DataManagementDialog } from './DataManagementDialog';
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
  onShowHelp?: () => void;
}

const VIEWS: { key: ViewType; label: string; cn: string; icon: any }[] = [
  { key: 'hourly', label: 'Hour', cn: '时', icon: Clock },
  { key: 'daily', label: 'Day', cn: '日', icon: Calendar },
  { key: 'monthly', label: 'Month', cn: '月', icon: CalendarDays },
  { key: 'yearly', label: 'Year', cn: '年', icon: CalendarRange },
];

const CalendarHeader = ({ view, onViewChange, selectedDate, onShowHelp }: CalendarHeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const year = selectedDate.getFullYear();
  const zodiac = getYearZodiac(year);
  const stemBranch = getYearStemBranch(year);

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold leading-tight">
            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h1>
          <p className="text-xs text-muted-foreground">
            {stemBranch.full}年 · {stemBranch.element}{zodiac.cn}年
          </p>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-muted rounded-full transition-colors flex items-center justify-center">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Switch View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {VIEWS.map(v => (
                <DropdownMenuItem
                  key={v.key}
                  onClick={() => onViewChange(v.key)}
                  className={view === v.key ? 'bg-muted font-bold' : ''}
                >
                  <v.icon className="mr-2 h-4 w-4 opacity-70" />
                  <span className="flex-1">{v.label}</span>
                  <span className="ml-2 text-xs opacity-40 font-serif">{v.cn}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-muted rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Calendar Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {onShowHelp && (
                <>
                  <DropdownMenuItem onClick={onShowHelp}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Tutorial</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>BaZi Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDataOpen(true)}>
                <Database className="mr-2 h-4 w-4" />
                <span>Data Management</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAboutOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
      <DataManagementDialog open={dataOpen} onClose={() => setDataOpen(false)} />

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>About Lunar Calendar</DialogTitle>
            <DialogDescription>
              A personalized BaZi-aware Chinese Zodiac calendar focused on work risk analysis and behavioral patterns.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-2 py-2">
            <p>Version 1.1.0</p>
            <p>PWA enabled for standalone mobile experience.</p>
            <div className="pt-2 border-t border-border">
              <p className="font-medium text-foreground mb-1">Community</p>
              <a 
                href="https://discord.gg/gMhvWg5Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                Join our Discord
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default CalendarHeader;
