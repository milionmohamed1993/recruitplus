import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E5F4FF] via-[#EDF7FF] to-[#F5FAFF] p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="/lovable-uploads/b25c4c6c-53d6-47aa-b9b1-c97f4b34ec86.png" 
            alt="RecruitPlus Logo" 
            className="h-24 md:h-32 mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight text-[#0066CC]">
            Willkommen bei RecruitPlus
          </h1>
          <p className="text-sm text-[#4D4D4D]">
            Melden Sie sich an, um auf Ihr Recruiting-Dashboard zuzugreifen
          </p>
        </div>
        
        <Card className="w-full border-[#E5F4FF] shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[#0066CC]">Anmelden</CardTitle>
            <CardDescription className="text-center text-[#4D4D4D]">
              Geben Sie Ihre Anmeldedaten ein, um auf Ihr Konto zuzugreifen
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    borderRadius: '6px',
                    height: '40px',
                    backgroundColor: '#0066CC',
                    color: 'white',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: '#0052A3',
                    },
                  },
                  input: {
                    borderRadius: '6px',
                    height: '40px',
                    padding: '8px 12px',
                    borderColor: '#E5F4FF',
                    '&:focus': {
                      borderColor: '#0066CC',
                      boxShadow: '0 0 0 2px rgba(0, 102, 204, 0.1)',
                    },
                  },
                  anchor: {
                    color: '#0066CC',
                    '&:hover': {
                      color: '#0052A3',
                    },
                  },
                  container: {
                    width: '100%',
                  },
                  message: {
                    color: '#4D4D4D',
                  },
                  label: {
                    color: '#4D4D4D',
                  },
                },
                variables: {
                  default: {
                    colors: {
                      brand: '#0066CC',
                      brandAccent: '#0052A3',
                      inputBackground: 'white',
                      inputBorder: '#E5F4FF',
                      inputBorderHover: '#0066CC',
                      inputBorderFocus: '#0066CC',
                    },
                  },
                },
              }}
              providers={[]}
              view="sign_in"
              showLinks={true}
              theme="light"
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'E-Mail',
                    password_label: 'Passwort',
                    email_input_placeholder: 'Ihre E-Mail-Adresse',
                    password_input_placeholder: 'Ihr Passwort',
                    button_label: 'Anmelden',
                    loading_button_label: 'Anmeldung läuft ...',
                    social_provider_text: 'Anmelden mit {{provider}}',
                    link_text: "Noch kein Konto? Jetzt registrieren",
                  },
                  forgotten_password: {
                    link_text: 'Passwort vergessen?',
                    button_label: 'Passwort zurücksetzen',
                    loading_button_label: 'Sende Anweisungen ...',
                    confirmation_text: 'Überprüfen Sie Ihre E-Mails auf den Reset-Link',
                  },
                  sign_up: {
                    email_label: 'E-Mail',
                    password_label: 'Passwort',
                    email_input_placeholder: 'Ihre E-Mail-Adresse',
                    password_input_placeholder: 'Ihr Passwort',
                    button_label: 'Registrieren',
                    loading_button_label: 'Registrierung läuft ...',
                    link_text: 'Bereits ein Konto? Jetzt anmelden',
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}