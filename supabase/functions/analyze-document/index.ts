import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file) {
      throw new Error('No file provided');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload file to get its contents
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error('Failed to upload file');
    }

    // Get the file URL
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(fileName);

    // Download the file to get its contents
    const fileResponse = await fetch(publicUrl);
    const fileContent = await fileResponse.text();

    // Analyze the content with OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: type === 'reference' 
              ? "Du bist ein Experte im Analysieren von deutschen Arbeitszeugnissen. Analysiere das Arbeitszeugnis und gib eine kurze Zusammenfassung der Bewertung des Mitarbeiters. Berücksichtige dabei die typische 'Geheimsprache' in deutschen Arbeitszeugnissen. Fasse deine Analyse in 2-3 Sätzen zusammen."
              : "Analyze this document and provide a brief evaluation.",
          },
          {
            role: "user",
            content: fileContent,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Failed to analyze document with OpenAI');
    }

    const openAIData = await openAIResponse.json();
    const evaluation = openAIData.choices[0].message.content;

    // Clean up - delete the temporary file
    await supabase.storage
      .from('attachments')
      .remove([fileName]);

    return new Response(
      JSON.stringify({ evaluation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});