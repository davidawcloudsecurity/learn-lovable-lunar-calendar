export interface QuizFormData {
  email: string;
  experience: string;
  goal: string;
  frequency: string;
  commitment: string;
  learningStyle: string;
  firstName: string;
  lastName: string;
  phone: string;
  agreeToTerms: boolean;
}

export async function submitQuizToGoogleSheets(data: QuizFormData): Promise<boolean> {
  // Get the URL from environment variable (try both with and without VITE_ prefix)
  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || import.meta.env.GOOGLE_SCRIPT_URL;
  
  if (!GOOGLE_SCRIPT_URL) {
    console.error('VITE_GOOGLE_SCRIPT_URL or GOOGLE_SCRIPT_URL environment variable is not set');
    return false;
  }
  
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });

    // With no-cors mode, we can't read the response, so we assume success
    return true;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return false;
  }
}
