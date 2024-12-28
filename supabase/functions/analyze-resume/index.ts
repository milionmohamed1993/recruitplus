import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Du bist ein Experte im Analysieren von Lebensläufen. 
            Extrahiere die folgenden Informationen aus diesem Lebenslauf und formatiere sie als JSON:
            {
              "personalInfo": {
                "name": "",
                "email": "",
                "phone": "",
                "birthdate": "",
                "address": "",
                "nationality": "",
                "location": ""
              },
              "professionalInfo": {
                "position": "",
                "company": "",
                "department": "",
                "industry": "",
                "experience": ""
              },
              "education": {
                "degree": "",
                "university": ""
              }
            }`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    
    return new Response(JSON.stringify(data.choices[0].message.content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})