import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import HorseMascot from '@/components/HorseMascot';
import { ArrowLeft, ArrowRight, Loader2, Shield, TrendingUp, Eye } from 'lucide-react';

interface QuizModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 7;

export default function QuizModal({ open, onOpenChange }: QuizModalProps) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
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
    };

    const handleNext = () => {
        if (step < TOTAL_STEPS) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        onOpenChange(false);
        navigate('/app');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8 py-4">
                        <div className="text-center space-y-4">
                            <h3 className="font-sans text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight">
                                Want Better Decision Making?
                            </h3>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                                Answer 5 quick questions and I will give you a step-by-step <span className="font-bold text-foreground">60-day action plan</span> showing you exactly what you need to do to master your patterns.
                            </p>
                        </div>

                        <div className="max-w-xl mx-auto w-full">
                            <div className="flex gap-3 h-14">
                                <Input
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={(e) => updateData('email', e.target.value)}
                                    className="h-full text-lg bg-background border-2 focus-visible:ring-0 focus-visible:border-primary px-4"
                                />
                                <Button
                                    onClick={handleNext}
                                    className="h-full px-8 text-lg font-bold uppercase tracking-wide bg-[#F95738] hover:bg-[#F95738]/90 text-white shadow-none rounded-md shrink-0"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 max-w-2xl mx-auto pt-4">
                            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-gray-100">
                                <HorseMascot />
                            </div>
                            <div className="bg-[#F5F5F5] p-5 rounded-lg relative text-muted-foreground leading-relaxed text-sm sm:text-base">
                                We analyze your patterns to identify risks, opportunities, and repetitive cycles.
                                <div className="absolute top-1/2 -left-2 -mt-2 w-4 h-4 bg-[#F5F5F5] transform rotate-45" />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="font-serif text-xl font-medium text-center">What is your BaZi knowledge level?</h3>
                        <RadioGroup value={formData.experience} onValueChange={(v) => updateData('experience', v)} className="space-y-3">
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
                        <h3 className="font-serif text-xl font-medium text-center">What do you want to achieve?</h3>
                        <RadioGroup value={formData.goal} onValueChange={(v) => updateData('goal', v)} className="space-y-3">
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
                        <h3 className="font-serif text-xl font-medium text-center">How often do you check your chart?</h3>
                        <RadioGroup value={formData.frequency} onValueChange={(v) => updateData('frequency', v)} className="space-y-3">
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
                        <h3 className="font-serif text-xl font-medium text-center">How committed are you to tracking?</h3>
                        <RadioGroup value={formData.commitment} onValueChange={(v) => updateData('commitment', v)} className="space-y-3">
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
                            <h3 className="font-serif text-xl font-medium">Congrats! You're one step away from your 60-day action plan.</h3>
                            <p className="text-muted-foreground">How would you prefer to learn?</p>
                        </div>

                        <RadioGroup value={formData.learningStyle} onValueChange={(v) => updateData('learningStyle', v)} className="space-y-3">
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
                            <h3 className="font-serif text-2xl font-bold">Your results are ready!</h3>
                            <p className="text-muted-foreground">
                                To get your results and a step-by-step guide on mastering your patterns, just enter in your name and email.
                            </p>
                        </div>

                        <div className="space-y-4 text-left bg-muted/30 p-6 rounded-xl border border-border/50">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => updateData('firstName', e.target.value)}
                                    className="h-11"
                                />
                                <Input
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => updateData('lastName', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <Input
                                placeholder="Your Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateData('email', e.target.value)}
                                className="h-11"
                            />
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
                        </div>

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
            <DialogContent className="max-w-none w-screen h-screen flex flex-col p-0 gap-0 overflow-hidden border-none shadow-none rounded-none bg-white">
                {/* Close Button is usually provided by DialogContent, ensure it's visible if needed, 
                    but here we might want to let the user close it naturally or add a custom one if the default is hidden/styled oddly. 
                    Default DialogContent usually has a Close button. We'll rely on that for now or check if we need to overriding styles.
                */}

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

                {/* Footer Actions */}
                {step > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm border-t border-border/40 flex justify-between items-center gap-4 max-w-3xl mx-auto w-full">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`text-muted-foreground hover:text-foreground ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={loading || (step === TOTAL_STEPS && !formData.agreeToTerms)}
                            className="w-full sm:w-auto min-w-[140px] px-8 py-6 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02]"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : step === TOTAL_STEPS ? (
                                'Yes, Send Me The Results'
                            ) : (
                                <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
