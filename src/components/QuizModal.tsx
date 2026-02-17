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

const TOTAL_STEPS = 7;

export default function QuizModal({ open, onOpenChange }: QuizModalProps) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        url: '',
        experience: '',
        goal: '',
        frequency: '',
        commitment: '',
        learningStyle: '',
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
                if (!formData.experience) {
                    newErrors.experience = 'Please select your knowledge level';
                }
                break;
            case 3:
                if (!formData.goal) {
                    newErrors.goal = 'Please select what you want to achieve';
                }
                break;
            case 4:
                if (!formData.frequency) {
                    newErrors.frequency = 'Please select how often you check your chart';
                }
                break;
            case 5:
                if (!formData.commitment) {
                    newErrors.commitment = 'Please select your commitment level';
                }
                break;
            case 6:
                if (!formData.learningStyle) {
                    newErrors.learningStyle = 'Please select your learning preference';
                }
                break;
            case 7:
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
                    newErrors.agreeToTerms = 'You must agree to receive the results';
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
                experience: formData.experience,
                goal: formData.goal,
                frequency: formData.frequency,
                commitment: formData.commitment,
                learningStyle: formData.learningStyle,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                agreeToTerms: formData.agreeToTerms,
            });

            if (success) {
                toast({
                    title: "Success!",
                    description: "Your responses have been saved. Redirecting to the app...",
                });
                
                // Wait a bit before navigating
                await new Promise(resolve => setTimeout(resolve, 1500));
                onOpenChange(false);
                navigate('/app');
            } else {
                toast({
                    title: "Submission failed",
                    description: "There was an error saving your responses. Please try again.",
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
                                Want Better Decision Making?
                            </h3>
                            <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Answer 5 quick questions and I will give you a step-by-step <span className="font-bold text-foreground">60-day action plan</span> showing you exactly what you need to do to master your patterns.
                            </p>
                        </div>

                        <div className="max-w-lg mx-auto w-full space-y-2">
                            <div className="flex gap-2 h-12">
                                <Input
                                    placeholder="Enter your email address"
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
                                    Next
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
                                We analyze your patterns to identify risks, opportunities, and repetitive cycles.
                                <div className="absolute top-1/2 -left-1.5 -mt-1.5 w-3 h-3 bg-[#F5F5F5] transform rotate-45 border-l border-b border-gray-100/50" />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>What is your BaZi knowledge level?</h3>
                        {errors.experience && (
                            <div className="border-2 border-blue-400 bg-blue-50 p-3 rounded-md">
                                <p className="text-red-600 text-sm text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {errors.experience}
                                </p>
                            </div>
                        )}
                        <RadioGroup value={formData.experience} onValueChange={(v) => handleAutoAdvance(v, 'experience')} className="space-y-3">
                            {['Beginner', 'Intermediate', 'Advanced'].map((opt) => (
                                <div key={opt} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.experience === opt ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="flex-1 cursor-pointer font-medium text-base">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg mt-4">
                            <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <HorseMascot small />
                            </div>
                            <p className="text-xs text-muted-foreground">This helps us determine how much depth to include in your action plan.</p>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>What do you want to achieve?</h3>
                        <RadioGroup value={formData.goal} onValueChange={(v) => handleAutoAdvance(v, 'goal')} className="space-y-3">
                            {[
                                { val: 'Avoid bad decisions', icon: Shield },
                                { val: 'Understand my patterns', icon: Eye },
                                { val: 'Plan better timing', icon: TrendingUp }
                            ].map((opt) => (
                                <div key={opt.val} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.goal === opt.val ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
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
                            <p className="text-xs text-muted-foreground">We want to give you an action plan that you can easily implement.</p>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>How often do you check your chart?</h3>
                        <RadioGroup value={formData.frequency} onValueChange={(v) => handleAutoAdvance(v, 'frequency')} className="space-y-3">
                            {['Daily', 'Weekly', 'Monthly', 'Rarely'].map((opt) => (
                                <div key={opt} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.frequency === opt ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="flex-1 cursor-pointer font-medium text-base">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg mt-4">
                            <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <HorseMascot small />
                            </div>
                            <p className="text-xs text-muted-foreground">We want to give you a plan that fits your routine.</p>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>How committed are you to tracking?</h3>
                        <RadioGroup value={formData.commitment} onValueChange={(v) => handleAutoAdvance(v, 'commitment')} className="space-y-3">
                            {['I want to track everything', 'Just big events', 'I need reminders', 'I\'m not sure yet'].map((opt) => (
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
                            <p className="text-xs text-muted-foreground">This helps us understand how much automation you need.</p>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <div className="text-center space-y-2 mb-6">
                            <h3 className="text-xl font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Congrats! You're one step away from your 60-day action plan.</h3>
                            <p className="text-muted-foreground" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>How would you prefer to learn?</p>
                        </div>

                        <RadioGroup value={formData.learningStyle} onValueChange={(v) => handleAutoAdvance(v, 'learningStyle')} className="space-y-3">
                            {['I\'ll learn by doing', 'I want guided lessons', 'I want analytics only'].map((opt) => (
                                <div key={opt} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${formData.learningStyle === opt ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50 bg-background'}`}>
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="flex-1 cursor-pointer font-medium text-base">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-6 text-center">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Your results are ready!</h3>
                            <p className="text-muted-foreground" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                To get your results and a step-by-step guide on mastering your patterns, just enter in your name and email.
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
                                    I agree to receive my quiz results and a series of emails that will teach me how to interpret my patterns.
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
                            By clicking the button below, you consent for us to contact you at the number and email address provided. Privacy Policy.
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

                {/* Footer Actions - Only for Step 7 */}
                {step === 7 && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm border-t border-border/40 flex justify-center items-center gap-4 max-w-3xl mx-auto w-full">
                        <Button
                            onClick={handleNext}
                            disabled={loading || !formData.agreeToTerms}
                            className="w-full sm:w-auto min-w-[140px] px-8 py-6 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02]"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Yes, Send Me The Results'
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
