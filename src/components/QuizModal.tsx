import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import HorseMascot from '@/components/HorseMascot';
import { ArrowLeft, Loader2, Shield, TrendingUp, Eye } from 'lucide-react';
import { submitQuizToGoogleSheets } from '@/lib/quiz-submission';
import { useToast } from '@/hooks/use-toast';

interface QuizModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 6;

export default function QuizModal({ open, onOpenChange }: QuizModalProps) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        url: '',
        frustration: '',
        patterns: '',
        tracking: '',
        commitment: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        agreeToTerms: false
    });

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        // Clear error when user starts typing
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
    };

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.email) {
                    newErrors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email address (e.g. "example@domain.com")';
                }
                break;
            case 2:
                if (!formData.frustration) {
                    newErrors.frustration = 'Please select what frustrates you most';
                }
                break;
            case 3:
                if (!formData.patterns) {
                    newErrors.patterns = 'Please select an option';
                }
                break;
            case 4:
                if (!formData.tracking) {
                    newErrors.tracking = 'Please select your tracking preference';
                }
                break;
            case 5:
                if (!formData.commitment) {
                    newErrors.commitment = 'Please select how long you can commit';
                }
                break;
            case 6:
                if (!formData.firstName) {
                    newErrors.firstName = 'First name is required';
                }
                if (!formData.lastName) {
                    newErrors.lastName = 'Last name is required';
                }
                if (!formData.email) {
                    newErrors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email address';
                }
                if (!formData.agreeToTerms) {
                    newErrors.agreeToTerms = 'You must agree to receive your chart';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep()) {
            return;
        }

        if (step < TOTAL_STEPS) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleAutoAdvance = (value: string, key: string) => {
        updateData(key, value);
        // Auto-advance after a short delay to show selection
        setTimeout(() => {
            if (step < TOTAL_STEPS) {
                setStep(step + 1);
            }
        }, 300);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            // Submit to Google Sheets
            const success = await submitQuizToGoogleSheets({
                email: formData.email,
                frustration: formData.frustration,
                patterns: formData.patterns,
                tracking: formData.tracking,
                commitment: formData.commitment,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                agreeToTerms: formData.agreeToTerms,
            });

            if (success) {
                toast({
                    title: "Success!",
                    description: "Your chart is ready. Redirecting to the app...",
                });
                
                // Wait a bit before navigating
                await new Promise(resolve => setTimeout(resolve, 1500));
                onOpenChange(false);
                navigate('/app');
            } else {
                toast({
                    title: "Submission failed",
                    description: "There was an error. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 py-4">
                        <div className="text-center space-y-3">
                            <h3 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C] tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Ever Wonder Why You Keep Making the Same Mistakes?
                            </h3>
                            <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                I built this app because I was tired of missing opportunities and repeating bad decisions. 
                                Turns out my "bad days" follow a pattern. <span className="font-bold text-foreground">Maybe yours do too.</span>
                            </p>
                        </div>

                        <div className="max-w-lg mx-auto w-full space-y-2">
                            <div className="flex gap-2 h-12">
                                <Input
                                    placeholder="Enter your email to see your pattern"
                                    value={formData.email}
                                    onChange={(e) => updateData('email', e.target.value)}
                                    className={`h-full text-base bg-background border-2 focus-visible:ring-0 focus-visible:border-primary px-4 ${errors.email ? 'border-red-500' : ''}`}
                                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                                />
                                <Button
                                    onClick={handleNext}
                                    className="h-full px-6 text-base font-bold uppercase tracking-wide bg-[#F95738] hover:bg-[#F95738]/90 text-white shadow-none rounded-md shrink-0"
                                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                                >
                                    Show Me
                                </Button>
                            </div>
                            {errors.email && (
                                <p className="text-red-600 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-4 max-w-xl mx-auto pt-2">
                            <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-gray-100">
                                <HorseMascot />
                            </div>
                            <div className="bg-[#F5F5F5] p-3 rounded-lg relative text-muted-foreground leading-relaxed text-xs sm:text-sm shadow-sm border border-gray-100/50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                I'm tracking my decisions against my birth chart. Join me and let's see if there's a pattern.
                                <div className="absolute top-1/2 -left-1.5 -mt-1.5 w-3 h-3 bg-[#F5F5F5] transform rotate-45 border-l border-b border-gray-100/50" />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>What's your biggest frustration?</h3>
                        {errors.frustration && (
                            <div className="border-2 border-blue-400 bg-blue-50 p-3 rounded-md">
                                <p className="text-red-600 text-sm text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {errors.frustration}
                                </p>
                            </div>
                        )}
                        <RadioGroup value={formData.frustration} onValueChange={(v) => handleAutoAdvance(v, 'frustration')} className="space-y-3">
                            {[
                                { val: 'I repeat the same mistakes', icon: Shield },
                                { val: 'I miss opportunities', icon: Eye },
                                { val: 'Some days I\'m off and don\'t know why', icon: TrendingUp }
                            ].map((opt) => (
                                <div key={opt.val} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.frustration === opt.val ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
                                    <RadioGroupItem value={opt.val} id={opt.val} />
                                    <Label htmlFor={opt.val} className="flex-1 cursor-pointer font-medium text-base flex items-center gap-2">
                                        <opt.icon className="w-4 h-4 text-muted-foreground" />
                                        {opt.val}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg mt-4">
                            <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <HorseMascot small />
                            </div>
                            <p className="text-xs text-muted-foreground">Me too. That's exactly why I built this.</p>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Have you noticed patterns in your "good" vs "bad" days?</h3>
                        <RadioGroup value={formData.patterns} onValueChange={(v) => handleAutoAdvance(v, 'patterns')} className="space-y-3">
                            {['Yes, but I can\'t predict them', 'Sometimes, but I ignore them', 'No, feels random to me'].map((opt) => (
                                <div key={opt} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.patterns === opt ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="flex-1 cursor-pointer font-medium text-base">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg mt-4">
                            <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <HorseMascot small />
                            </div>
                            <p className="text-xs text-muted-foreground">I used to think it was random too. Then I started tracking.</p>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Would you track your decisions if it helped you see patterns?</h3>
                        <RadioGroup value={formData.tracking} onValueChange={(v) => handleAutoAdvance(v, 'tracking')} className="space-y-3">
                            {['Yes, I love tracking things', 'Maybe, if it\'s easy', 'Probably not, I\'m not a tracker'].map((opt) => (
                                <div key={opt} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.tracking === opt ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="flex-1 cursor-pointer font-medium text-base">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg mt-4">
                            <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <HorseMascot small />
                            </div>
                            <p className="text-xs text-muted-foreground">The app makes it simple. Just a few taps each day.</p>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>This is an experiment. How long can you commit to tracking?</h3>
                        <RadioGroup value={formData.commitment} onValueChange={(v) => handleAutoAdvance(v, 'commitment')} className="space-y-3">
                            {['30 days minimum', '60 days (recommended)', '90 days (best results)', 'I\'ll try, no promises'].map((opt) => (
                                <div key={opt} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.commitment === opt ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="flex-1 cursor-pointer font-medium text-base">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg mt-4">
                            <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <HorseMascot small />
                            </div>
                            <p className="text-xs text-muted-foreground">I saw my first clear pattern around day 30. By day 60, it was undeniable.</p>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6 text-center">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Let's See If This Works For You Too</h3>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                I'll send you your personal risk calendar (based on your birth chart), my findings from tracking 60+ days of decisions, and access to the decision tracker I built.
                            </p>
                            <p className="text-muted-foreground text-sm font-medium max-w-md mx-auto pt-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                No promises. Just honest experimentation.
                            </p>
                        </div>

                        <div className="space-y-4 text-left bg-muted/30 p-6 rounded-xl border border-border/50">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={(e) => updateData('firstName', e.target.value)}
                                        className={`h-11 ${errors.firstName ? 'border-red-500' : ''}`}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => updateData('lastName', e.target.value)}
                                        className={`h-11 ${errors.lastName ? 'border-red-500' : ''}`}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Input
                                    placeholder="Your Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateData('email', e.target.value)}
                                    className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <Input
                                placeholder="Phone Number (Optional)"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateData('phone', e.target.value)}
                                className="h-11"
                            />

                            <div className="flex items-start gap-2 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(c) => updateData('agreeToTerms', c)}
                                    className="mt-0.5"
                                />
                                <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal leading-tight">
                                    Send me my chart and updates on what patterns I discover. I can unsubscribe anytime.
                                </Label>
                            </div>
                            {errors.agreeToTerms && (
                                <p className="text-red-600 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {errors.agreeToTerms}
                                </p>
                            )}
                        </div>
                        
                        {Object.keys(errors).length > 0 && (
                            <div className="border-2 border-blue-400 bg-blue-50 p-3 rounded-md">
                                <p className="text-red-600 text-sm text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    One or more fields have an error. Please check and try again.
                                </p>
                            </div>
                        )}

                        <p className="text-[10px] text-muted-foreground/60 max-w-sm mx-auto">
                            I'm not a BaZi master. I'm just someone who got tired of repeating mistakes and built a tool to track patterns. Privacy Policy.
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showClose={step === 1} className="max-w-none w-screen h-screen sm:max-w-none sm:w-screen sm:h-screen sm:rounded-none sm:border-none flex flex-col p-0 gap-0 overflow-hidden border-none shadow-none rounded-none bg-white">
                {/* Back Button - Only shows on steps 2+ */}
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="absolute top-4 right-4 z-[60] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                )}

                {/* Content Area - Centered */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 bg-background relative">

                    {/* Progress Bar - Centered above content */}
                    <div className="w-full max-w-md mb-8">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#FA9F42] transition-all duration-500 ease-in-out"
                                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="w-full max-w-3xl">
                        {renderStep()}
                    </div>
                </div>

                {/* Footer Actions - Only for Step 6 */}
                {step === 6 && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm border-t border-border/40 flex justify-center items-center gap-4 max-w-3xl mx-auto w-full">
                        <Button
                            onClick={handleNext}
                            disabled={loading || !formData.agreeToTerms}
                            className="w-full sm:w-auto min-w-[140px] px-8 py-6 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02]"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Yes, Send Me My Chart'
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
