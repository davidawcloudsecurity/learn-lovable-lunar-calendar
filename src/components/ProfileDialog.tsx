import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, BaZiProfile, BaZiPillar, DEFAULT_PROFILE } from '@/lib/chinese-calendar';
import { loadProfile, saveProfile } from '@/lib/bazi-profile';
import { Label } from '@/components/ui/label';

interface ProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

const PillarSelect = ({
    label,
    pillar,
    onChange
}: {
    label: string,
    pillar: BaZiPillar,
    onChange: (p: BaZiPillar) => void
}) => {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
            <div className="grid grid-cols-2 gap-2">
                <select
                    value={pillar.stem}
                    onChange={(e) => onChange({ ...pillar, stem: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    {HEAVENLY_STEMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                    value={pillar.branch}
                    onChange={(e) => onChange({ ...pillar, branch: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    {EARTHLY_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>
        </div>
    );
};

export function ProfileDialog({ open, onClose }: ProfileDialogProps) {
    const [profile, setProfile] = useState<BaZiProfile | null>(null);

    useEffect(() => {
        if (open) {
            setProfile(loadProfile() || DEFAULT_PROFILE);
        }
    }, [open]);

    const handleSave = () => {
        if (profile) {
            saveProfile(profile);
            onClose();
            // Force a reload or state update if needed, but for now we rely on the next render
            window.location.reload();
        }
    };

    if (!profile) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-xs">
                <DialogHeader>
                    <DialogTitle className="font-serif">Update BaZi Profile</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <PillarSelect
                        label="Year Pillar (Roots)"
                        pillar={profile.yearPillar}
                        onChange={(p) => setProfile({ ...profile, yearPillar: p })}
                    />
                    <PillarSelect
                        label="Month Pillar (Career)"
                        pillar={profile.monthPillar}
                        onChange={(p) => setProfile({ ...profile, monthPillar: p })}
                    />
                    <PillarSelect
                        label="Day Pillar (Self)"
                        pillar={profile.dayPillar}
                        onChange={(p) => setProfile({ ...profile, dayPillar: p })}
                    />
                    <PillarSelect
                        label="Hour Pillar (Work)"
                        pillar={profile.hourPillar}
                        onChange={(p) => setProfile({ ...profile, hourPillar: p })}
                    />
                </div>

                <DialogFooter>
                    <Button onClick={handleSave} className="w-full">Save Profile</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
