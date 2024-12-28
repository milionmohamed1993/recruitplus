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
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Recruiting Platform
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your recruiting dashboard
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Please sign in using your email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    borderRadius: '6px',
                    height: '40px',
                    backgroundColor: 'hsl(var(--primary))',
                  },
                  input: {
                    borderRadius: '6px',
                    height: '40px',
                  },
                  anchor: {
                    color: 'hsl(var(--primary))',
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
                    email_label: 'Email',
                    password_label: 'Password',
                    button_label: 'Sign in',
                    loading_button_label: 'Signing in ...',
                    social_provider_text: 'Sign in with {{provider}}',
                    link_text: "Don't have an account? Sign up",
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