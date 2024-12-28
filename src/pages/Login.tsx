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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="/lovable-uploads/b25c4c6c-53d6-47aa-b9b1-c97f4b34ec86.png" 
            alt="RecruitPlus Logo" 
            className="h-24 md:h-32 mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Willkommen bei RecruitPlus
          </h1>
          <p className="text-sm text-muted-foreground">
            Melden Sie sich an, um auf Ihr Recruiting-Dashboard zuzugreifen
          </p>
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Anmelden</CardTitle>
            <CardDescription className="text-center">
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
                    backgroundColor: 'hsl(var(--primary))',
                    width: '100%',
                  },
                  input: {
                    borderRadius: '6px',
                    height: '40px',
                    padding: '8px 12px',
                  },
                  anchor: {
                    color: 'hsl(var(--primary))',
                  },
                  container: {
                    width: '100%',
                  },
                },
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(37, 99, 235)',
                      brandAccent: 'rgb(29, 78, 216)',
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
                    button_label: 'Anmelden',
                    loading_button_label: 'Anmeldung läuft ...',
                    social_provider_text: 'Anmelden mit {{provider}}',
                    link_text: "Noch kein Konto? Jetzt registrieren",
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